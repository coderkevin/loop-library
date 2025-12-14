import type { ScanResult, Settings } from '../../shared/types';
import type { LibraryApi } from '../features/library/libraryController';

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export const loopLibraryHttpApi: LibraryApi = {
  async getSettings() {
    return json<Settings>(await fetch('/api/settings'));
  },
  async pickLibraryRoot() {
    const r = await json<{ root: string | null }>(
      await fetch('/api/libraryRoots/pick', { method: 'POST' }),
    );
    return r.root;
  },
  async addLibraryRoot(root: string) {
    return json<Settings>(
      await fetch('/api/libraryRoots/add', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ root }),
      }),
    );
  },
  async removeLibraryRoot(root: string) {
    return json<Settings>(
      await fetch('/api/libraryRoots/remove', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ root }),
      }),
    );
  },
  async scanLibrary() {
    return json<ScanResult>(await fetch('/api/library/scan', { method: 'POST' }));
  },
};


