import type { Clip, Set, Settings, Track } from '../../shared/types.js';

export type ApiDeps = {
  loadSettings: () => Promise<Settings>;
  saveSettings: (settings: Settings) => Promise<void>;
  scanForAudioFiles: (roots: string[]) => Promise<string[]>;
  showOpenDirectoryDialog: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  loadTracks: () => Promise<Track[]>;
  saveTracks: (tracks: Track[]) => Promise<void>;
  buildTrackFromPath: (filePath: string) => Promise<Track>;

  loadClips: () => Promise<Clip[]>;
  saveClips: (clips: Clip[]) => Promise<void>;

  loadSets: () => Promise<Set[]>;
  saveSets: (sets: Set[]) => Promise<void>;

  loadPreparedClips: () => Promise<import('../../shared/types.js').PreparedClip[]>;
  savePreparedClips: (items: import('../../shared/types.js').PreparedClip[]) => Promise<void>;
};

export type AddRemoveBody = { root?: string };
