import { describe, expect, it, vi } from 'vitest';

import { createIpcHandlers } from './ipcHandlers';

describe('ipcHandlers', () => {
  it('pickLibraryRoot returns null when dialog canceled', async () => {
    const handlers = createIpcHandlers({
      loadSettings: vi.fn(async () => ({ libraryRoots: [] })),
      saveSettings: vi.fn(async () => undefined),
      scanForAudioFiles: vi.fn(async () => []),
      showOpenDirectoryDialog: vi.fn(async () => ({ canceled: true, filePaths: [] })),
    });

    const res = await handlers.handlePickLibraryRoot();
    expect(res).toBeNull();
  });

  it('addLibraryRoot de-dupes and persists', async () => {
    const saveSettings = vi.fn(async () => undefined);
    const handlers = createIpcHandlers({
      loadSettings: vi.fn(async () => ({ libraryRoots: ['/a'] })),
      saveSettings,
      scanForAudioFiles: vi.fn(async () => []),
      showOpenDirectoryDialog: vi.fn(async () => ({ canceled: false, filePaths: ['/x'] })),
    });

    const next = await handlers.handleAddLibraryRoot(undefined, '/a');
    expect(next.libraryRoots).toEqual(['/a']);
    expect(saveSettings).toHaveBeenCalledWith({ libraryRoots: ['/a'] });
  });
});


