import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function tryGetElectronUserDataDir(): string | null {
  // In a normal Node process, `process.versions.electron` is undefined.
  if (!process.versions.electron) {
    return null;
  }

  try {
    // In the Electron main process, `require('electron')` resolves to the built-in module.
    const { app } = require('electron') as typeof import('electron');
    return app.getPath('userData');
  } catch {
    return null;
  }
}

export function dataDir(): string {
  // Allow overriding in non-Electron environments (tests / server-only mode).
  const override = process.env.LOOP_LIBRARY_DATA_DIR;
  if (override) {
    return override;
  }

  const electronUserDataDir = tryGetElectronUserDataDir();
  if (electronUserDataDir) {
    return electronUserDataDir;
  }

  // Fallback for server-only / Node usage.
  return path.join(os.homedir(), '.loop-library');
}

export function settingsFile(): string {
  return path.join(dataDir(), 'settings.json');
}

export function tracksFile(): string {
  return path.join(dataDir(), 'tracks.json');
}

export function clipsFile(): string {
  return path.join(dataDir(), 'clips.json');
}

export function setsFile(): string {
  return path.join(dataDir(), 'sets.json');
}

export function preparedClipsFile(): string {
  return path.join(dataDir(), 'preparedClips.json');
}


