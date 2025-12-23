import { spawn } from 'node:child_process';

export type FfmpegOptions = {
  inputPath: string;
  outputPath: string;
  startSec: number;
  endSec: number;
  tempoRatio?: number; // targetBpm / sourceBpm
  pitchSemitones?: number;
};

function atempoFilterForRatio(ratio: number): string {
  // ffmpeg atempo supports 0.5..2.0, chain if outside.
  // We decompose ratio into multipliers within range.
  const parts: number[] = [];
  let r = ratio;
  while (r > 2.0) {
    parts.push(2.0);
    r /= 2.0;
  }
  while (r < 0.5) {
    parts.push(0.5);
    r /= 0.5;
  }
  parts.push(r);
  return parts.map((p) => `atempo=${p.toFixed(6)}`).join(',');
}

function buildAudioFilter(opts: { tempoRatio?: number; pitchSemitones?: number }): string | null {
  const parts: string[] = [];

  if (typeof opts.tempoRatio === 'number' && opts.tempoRatio > 0 && opts.tempoRatio !== 1) {
    parts.push(atempoFilterForRatio(opts.tempoRatio));
  }

  if (typeof opts.pitchSemitones === 'number' && opts.pitchSemitones !== 0) {
    // Prefer rubberband if available in ffmpeg build. This is a best-effort approach.
    // If rubberband isn't available, ffmpeg will error and caller can surface that.
    parts.push(`rubberband=pitch=${opts.pitchSemitones.toFixed(6)}`);
  }

  if (!parts.length) return null;
  return parts.join(',');
}

export async function renderClipWithFfmpeg(opts: FfmpegOptions): Promise<void> {
  const duration = Math.max(0, opts.endSec - opts.startSec);
  const audioFilter = buildAudioFilter({
    tempoRatio: opts.tempoRatio,
    pitchSemitones: opts.pitchSemitones,
  });

  const args: string[] = [
    '-hide_banner',
    '-y',
    '-ss',
    String(opts.startSec),
    '-t',
    String(duration),
    '-i',
    opts.inputPath,
  ];

  if (audioFilter) {
    args.push('-af', audioFilter);
  }

  // Output as wav (pcm16) for Strudel friendliness
  args.push('-acodec', 'pcm_s16le', opts.outputPath);

  await new Promise<void>((resolve, reject) => {
    const p = spawn('ffmpeg', args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    p.stderr.on('data', (d) => {
      err += String(d);
    });
    p.on('error', reject);
    p.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`ffmpeg exited with code ${code}\n${err}`));
    });
  });
}
