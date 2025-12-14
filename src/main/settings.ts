import { app } from 'electron';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { Settings } from '../shared/types.js';

const DEFAULT_SETTINGS: Settings = {
  libraryRoots: [],
};

function settingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await fs.readFile(settingsPath(), 'utf-8');
    const parsed = JSON.parse(raw) as Partial<Settings> | null;
    return {
      libraryRoots: Array.isArray(parsed?.libraryRoots) ? parsed!.libraryRoots : [],
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  const file = settingsPath();
  const dir = path.dirname(file);
  await fs.mkdir(dir, { recursive: true });

  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(settings, null, 2) + '\n', 'utf-8');
  await fs.rename(tmp, file);
}


