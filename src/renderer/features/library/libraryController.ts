import type { Clip, PreparedClip, ScanResult, Set, Settings, Track } from '../../../shared/types';

export type LibraryApi = {
  getSettings: () => Promise<Settings>;
  pickLibraryRoot: () => Promise<string | null>;
  addLibraryRoot: (root: string) => Promise<Settings>;
  removeLibraryRoot: (root: string) => Promise<Settings>;
  scanLibrary: () => Promise<ScanResult>;
  listTracks: () => Promise<Track[]>;

  listClips: () => Promise<Clip[]>;
  createClip: (input: {
    trackId: string;
    name: string;
    startSec: number;
    endSec: number;
    isLoop: boolean;
  }) => Promise<Clip>;

  listSets: () => Promise<Set[]>;
  createSet: (input: { name: string; targetBpm: number; targetKey?: string }) => Promise<Set>;
  pickSetExportDir: (setId: string) => Promise<{ setId: string; exportDir: string | null }>;
  addClipToSet: (input: { setId: string; clipId: string }) => Promise<{ setId: string; clipId: string }>;
  removeClipFromSet: (input: { setId: string; clipId: string }) => Promise<{ setId: string; clipId: string }>;
  exportSet: (setId: string) => Promise<{ exportDir: string; preparedClips: PreparedClip[] }>;
};

export type LibraryController = {
  loadSettings: () => Promise<Settings>;
  addRootViaPicker: () => Promise<Settings | null>;
  removeRoot: (root: string) => Promise<Settings>;
  scan: () => Promise<ScanResult>;
  listTracks: () => Promise<Track[]>;

  listClips: () => Promise<Clip[]>;
  createClip: (input: {
    trackId: string;
    name: string;
    startSec: number;
    endSec: number;
    isLoop: boolean;
  }) => Promise<Clip>;

  listSets: () => Promise<Set[]>;
  createSet: (input: { name: string; targetBpm: number; targetKey?: string }) => Promise<Set>;
  pickSetExportDir: (setId: string) => Promise<{ setId: string; exportDir: string | null }>;
  addClipToSet: (input: { setId: string; clipId: string }) => Promise<{ setId: string; clipId: string }>;
  removeClipFromSet: (input: { setId: string; clipId: string }) => Promise<{ setId: string; clipId: string }>;
  exportSet: (setId: string) => Promise<{ exportDir: string; preparedClips: PreparedClip[] }>;
};

export function createLibraryController(api: LibraryApi): LibraryController {
  return {
    loadSettings: () => api.getSettings(),

    addRootViaPicker: async () => {
      const picked = await api.pickLibraryRoot();
      if (!picked) {
        return null;
      }
      return api.addLibraryRoot(picked);
    },

    removeRoot: (root: string) => api.removeLibraryRoot(root),

    scan: () => api.scanLibrary(),

    listTracks: () => api.listTracks(),

    listClips: () => api.listClips(),
    createClip: (input) => api.createClip(input),

    listSets: () => api.listSets(),
    createSet: (input) => api.createSet(input),
    pickSetExportDir: (setId) => api.pickSetExportDir(setId),
    addClipToSet: (input) => api.addClipToSet(input),
    removeClipFromSet: (input) => api.removeClipFromSet(input),
    exportSet: (setId) => api.exportSet(setId),
  };
}
