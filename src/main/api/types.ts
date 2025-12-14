import type { Settings } from '../../shared/types.js';

export type ApiDeps = {
  loadSettings: () => Promise<Settings>;
  saveSettings: (settings: Settings) => Promise<void>;
  scanForAudioFiles: (roots: string[]) => Promise<string[]>;
  showOpenDirectoryDialog: () => Promise<{ canceled: boolean; filePaths: string[] }>;
};

export type AddRemoveBody = { root?: string };


