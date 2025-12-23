import type { Settings } from '../shared/types.js';
import { loadSettingsStore, saveSettingsStore } from './storage/stores.js';

export async function loadSettings(): Promise<Settings> {
  return loadSettingsStore();
}

export async function saveSettings(settings: Settings): Promise<void> {
  await saveSettingsStore(settings);
}
