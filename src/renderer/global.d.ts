export {};

import type { ScanResult, Settings } from '../shared/types';

declare global {
  interface Window {
    loopLibrary: {
      ping: () => string;
      getSettings: () => Promise<Settings>;
      pickLibraryRoot: () => Promise<string | null>;
      addLibraryRoot: (root: string) => Promise<Settings>;
      removeLibraryRoot: (root: string) => Promise<Settings>;
      scanLibrary: () => Promise<ScanResult>;
    };
  }
}


