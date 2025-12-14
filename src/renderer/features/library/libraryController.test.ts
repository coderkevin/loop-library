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
    };

    const controller = createLibraryController(api);
    const result = await controller.addRootViaPicker();

    expect(result).toEqual({ libraryRoots: ['/music'] });
    expect(api.addLibraryRoot).toHaveBeenCalledWith('/music');
  });
});


