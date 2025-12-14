import type { ScanResult, Settings } from '../shared/types.js';

export type IpcDeps = {
  loadSettings: () => Promise<Settings>;
  saveSettings: (settings: Settings) => Promise<void>;
  scanForAudioFiles: (roots: string[]) => Promise<string[]>;
  showOpenDirectoryDialog: () => Promise<{ canceled: boolean; filePaths: string[] }>;
};

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function createIpcHandlers(deps: IpcDeps) {
  async function handleGetSettings(): Promise<Settings> {
    return deps.loadSettings();
  }

  async function handlePickLibraryRoot(): Promise<string | null> {
    const res = await deps.showOpenDirectoryDialog();
    if (res.canceled || res.filePaths.length === 0) {
      return null;
    }
    return res.filePaths[0];
  }

  async function handleAddLibraryRoot(_evt: unknown, root: string): Promise<Settings> {
    const s = await deps.loadSettings();
    const next = { ...s, libraryRoots: uniq([...s.libraryRoots, root]) };
    await deps.saveSettings(next);
    return next;
  }

  async function handleRemoveLibraryRoot(_evt: unknown, root: string): Promise<Settings> {
    const s = await deps.loadSettings();
    const next = { ...s, libraryRoots: s.libraryRoots.filter((r) => r !== root) };
    await deps.saveSettings(next);
    return next;
  }

  async function handleScanLibrary(): Promise<ScanResult> {
    const s = await deps.loadSettings();
    const files = await deps.scanForAudioFiles(s.libraryRoots);
    return { roots: s.libraryRoots, files };
  }

  return {
    handleGetSettings,
    handlePickLibraryRoot,
    handleAddLibraryRoot,
    handleRemoveLibraryRoot,
    handleScanLibrary,
  };
}
