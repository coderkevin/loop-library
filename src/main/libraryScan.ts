import fs from 'node:fs/promises';
import path from 'node:path';

const AUDIO_EXTS = new Set(['.wav', '.mp3', '.aiff', '.aif', '.flac', '.ogg']);

async function isDirectory(p: string): Promise<boolean> {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function walk(dir: string, out: string[]): Promise<void> {
  let entries: Array<import('node:fs').Dirent>;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const ent of entries) {
    // Skip hidden dirs/files (helps avoid noise and huge scans)
    if (ent.name.startsWith('.')) {
      continue;
    }

    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      await walk(full, out);
      continue;
    }
    if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (AUDIO_EXTS.has(ext)) {
        out.push(full);
      }
    }
  }
}

export async function scanForAudioFiles(roots: string[]): Promise<string[]> {
  const out: string[] = [];
  for (const root of roots) {
    if (!(await isDirectory(root))) {
      continue;
    }
    await walk(root, out);
  }
  // Stable-ish order
  out.sort((a, b) => a.localeCompare(b));
  return out;
}
