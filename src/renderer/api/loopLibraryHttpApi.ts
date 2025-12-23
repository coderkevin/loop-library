import type { Clip, PreparedClip, ScanResult, Set, Settings, Track } from '../../shared/types';
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

  async listTracks() {
    return json<Track[]>(await fetch('/api/tracks'));
  },

  async listClips() {
    return json<Clip[]>(await fetch('/api/clips'));
  },

  async createClip(input: {
    trackId: string;
    name: string;
    startSec: number;
    endSec: number;
    isLoop: boolean;
  }) {
    return json<Clip>(
      await fetch('/api/clips/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      }),
    );
  },

  async listSets() {
    return json<Set[]>(await fetch('/api/sets'));
  },

  async createSet(input: { name: string; targetBpm: number; targetKey?: string }) {
    return json<Set>(
      await fetch('/api/sets/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      }),
    );
  },

  async pickSetExportDir(setId: string) {
    return json<{ setId: string; exportDir: string | null }>(
      await fetch('/api/sets/pickExportDir', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ setId }),
      }),
    );
  },

  async addClipToSet(input: { setId: string; clipId: string }) {
    return json<{ setId: string; clipId: string }>(
      await fetch('/api/sets/addClip', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      }),
    );
  },

  async removeClipFromSet(input: { setId: string; clipId: string }) {
    return json<{ setId: string; clipId: string }>(
      await fetch('/api/sets/removeClip', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      }),
    );
  },

  async exportSet(setId: string) {
    return json<{ exportDir: string; preparedClips: PreparedClip[] }>(
      await fetch('/api/sets/export', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ setId }),
      }),
    );
  },
};


