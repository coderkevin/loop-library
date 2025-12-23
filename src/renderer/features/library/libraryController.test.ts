import { describe, expect, it, vi } from 'vitest';

import type { LibraryApi } from './libraryController';
import { createLibraryController } from './libraryController';
import type { ScanResult, Settings } from '../../../shared/types';

describe('libraryController', () => {
  it('returns null if user cancels folder picker', async () => {
    const api: LibraryApi = {
      getSettings: vi.fn(async () => ({ libraryRoots: [] } satisfies Settings)),
      pickLibraryRoot: vi.fn(async () => null),
      addLibraryRoot: vi.fn(async () => ({ libraryRoots: [] } satisfies Settings)),
      removeLibraryRoot: vi.fn(async () => ({ libraryRoots: [] } satisfies Settings)),
      scanLibrary: vi.fn(async () => ({ roots: [], files: [] } satisfies ScanResult)),
      listTracks: vi.fn(async () => []),
      listClips: vi.fn(async () => []),
      createClip: vi.fn(async () => {
        throw new Error('not needed in test');
      }),
      listSets: vi.fn(async () => []),
      createSet: vi.fn(async () => {
        throw new Error('not needed in test');
      }),
      pickSetExportDir: vi.fn(async () => ({ setId: 'x', exportDir: null })),
      addClipToSet: vi.fn(async () => ({ setId: 'x', clipId: 'y' })),
      removeClipFromSet: vi.fn(async () => ({ setId: 'x', clipId: 'y' })),
      exportSet: vi.fn(async () => ({ exportDir: '/out', preparedClips: [] })),
    };

    const controller = createLibraryController(api);
    const result = await controller.addRootViaPicker();

    expect(result).toBeNull();
    expect(api.addLibraryRoot).not.toHaveBeenCalled();
  });

  it('adds picked folder via api', async () => {
    const api: LibraryApi = {
      getSettings: vi.fn(async () => ({ libraryRoots: [] } satisfies Settings)),
      pickLibraryRoot: vi.fn(async () => '/music'),
      addLibraryRoot: vi.fn(async (root: string) => ({ libraryRoots: [root] } satisfies Settings)),
      removeLibraryRoot: vi.fn(async () => ({ libraryRoots: [] } satisfies Settings)),
      scanLibrary: vi.fn(async () => ({ roots: [], files: [] } satisfies ScanResult)),
      listTracks: vi.fn(async () => []),
      listClips: vi.fn(async () => []),
      createClip: vi.fn(async () => {
        throw new Error('not needed in test');
      }),
      listSets: vi.fn(async () => []),
      createSet: vi.fn(async () => {
        throw new Error('not needed in test');
      }),
      pickSetExportDir: vi.fn(async () => ({ setId: 'x', exportDir: null })),
      addClipToSet: vi.fn(async () => ({ setId: 'x', clipId: 'y' })),
      removeClipFromSet: vi.fn(async () => ({ setId: 'x', clipId: 'y' })),
      exportSet: vi.fn(async () => ({ exportDir: '/out', preparedClips: [] })),
    };

    const controller = createLibraryController(api);
    const result = await controller.addRootViaPicker();

    expect(result).toEqual({ libraryRoots: ['/music'] });
    expect(api.addLibraryRoot).toHaveBeenCalledWith('/music');
  });
});


