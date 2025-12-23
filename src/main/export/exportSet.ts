import fs from 'node:fs/promises';
import path from 'node:path';

import type { Clip, PreparedClip, Set, Track } from '../../shared/types.js';
import { renderClipWithFfmpeg } from '../audio/ffmpeg.js';
import { buildStrudelHelperSource } from './strudelHelper.js';

function nowIso(): string {
  return new Date().toISOString();
}

function safeName(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

function fileNameForPreparedClip(input: { set: Set; clip: Clip; track: Track }): string {
  const trackPart = safeName(`${input.track.artist ?? ''}_${input.track.title ?? ''}`) || safeName(path.parse(input.track.path).name);
  const clipPart = safeName(input.clip.name) || 'clip';
  const bpmPart = `${Math.round(input.set.targetBpm)}bpm`;
  const keyPart = input.set.targetKey ? safeName(input.set.targetKey) : 'nokey';
  return `${trackPart}_${clipPart}_${bpmPart}_${keyPart}.wav`;
}

export async function exportSet({
  setId,
  sets,
  clips,
  tracks,
}: {
  setId: string;
  sets: Set[];
  clips: Clip[];
  tracks: Track[];
}): Promise<{ preparedClips: PreparedClip[]; exportDir: string }> {
  const set = sets.find((s) => s.id === setId);
  if (!set) throw new Error('set not found');
  if (!set.exportDir) throw new Error('set exportDir not set');

  const setFolder = path.join(set.exportDir, safeName(set.name) || 'set');
  await fs.mkdir(setFolder, { recursive: true });

  const clipById = new Map(clips.map((c) => [c.id, c]));
  const trackById = new Map(tracks.map((t) => [t.id, t]));

  const preparedClips: PreparedClip[] = [];

  for (const clipId of set.clipIds) {
    const clip = clipById.get(clipId);
    if (!clip) continue;
    const track = trackById.get(clip.trackId);
    if (!track) continue;

    const outFile = path.join(setFolder, fileNameForPreparedClip({ set, clip, track }));

    const sourceBpm = track.bpmOverride ?? track.bpmDetected;
    const tempoRatio = sourceBpm ? set.targetBpm / sourceBpm : undefined;

    // Key-based pitch shifting is best-effort. If you want deterministic behavior, store semitone offsets.
    const pitchSemitones = 0;

    await renderClipWithFfmpeg({
      inputPath: track.path,
      outputPath: outFile,
      startSec: clip.startSec,
      endSec: clip.endSec,
      tempoRatio,
      pitchSemitones,
    });

    preparedClips.push({
      id: `${set.id}:${clip.id}`,
      setId: set.id,
      clipId: clip.id,
      bpm: set.targetBpm,
      key: set.targetKey,
      format: 'wav',
      path: outFile,
      createdAt: nowIso(),
    });
  }

  // Generate Strudel helper module alongside audio files.
  const helperSource = buildStrudelHelperSource({
    preparedClips,
    clipsById: clipById,
    exportDir: setFolder,
  });
  await fs.writeFile(path.join(setFolder, 'strudel-clips.js'), helperSource, 'utf-8');

  return { preparedClips, exportDir: setFolder };
}


