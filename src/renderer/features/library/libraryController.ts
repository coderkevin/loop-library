import type { ScanResult, Settings } from '../../../shared/types';

export type LibraryApi = {
  getSettings: () => Promise<Settings>;
  pickLibraryRoot: () => Promise<string | null>;
  addLibraryRoot: (root: string) => Promise<Settings>;
  removeLibraryRoot: (root: string) => Promise<Settings>;
  scanLibrary: () => Promise<ScanResult>;
};

export type LibraryController = {
  loadSettings: () => Promise<Settings>;
  addRootViaPicker: () => Promise<Settings | null>;
  removeRoot: (root: string) => Promise<Settings>;
  scan: () => Promise<ScanResult>;
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
  };
}
