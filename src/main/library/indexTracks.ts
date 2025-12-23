import { parseFile } from 'music-metadata';
import path from 'node:path';

import type { Track } from '../../shared/types.js';

function nowIso(): string {
  return new Date().toISOString();
}

function trackIdFromPath(p: string): string {
  // Good enough for a local tool; can be replaced with a content hash later.
  return p;
}

function fallbackTitleFromPath(p: string): string {
  return path.parse(p).name;
}

export async function buildTrackFromPath(filePath: string): Promise<Track> {
  const id = trackIdFromPath(filePath);
  const ts = nowIso();

  try {
    const meta = await parseFile(filePath, { duration: true });
    const title = meta.common.title ?? fallbackTitleFromPath(filePath);
    const artist = meta.common.artist ?? undefined;
    const durationSec = typeof meta.format.duration === 'number' ? meta.format.duration : undefined;

    return {
      id,
      path: filePath,
      title,
      artist,
      durationSec,
      createdAt: ts,
      updatedAt: ts,
    };
  } catch {
    return {
      id,
      path: filePath,
      title: fallbackTitleFromPath(filePath),
      createdAt: ts,
      updatedAt: ts,
    };
  }
}
