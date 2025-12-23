import type { Request, Response } from 'express';

import type { Track } from '../../../shared/types.js';
import type { ApiDeps } from '../types.js';

function byPath(a: Track, b: Track): number {
  return a.path.localeCompare(b.path);
}

export function createScanLibraryHandler(
  deps: Pick<
    ApiDeps,
    'loadSettings' | 'scanForAudioFiles' | 'loadTracks' | 'saveTracks' | 'buildTrackFromPath'
  >,
) {
  return async function scanLibraryHandler(_req: Request, res: Response) {
    const s = await deps.loadSettings();
    const filePaths = await deps.scanForAudioFiles(s.libraryRoots);

    const existing = await deps.loadTracks();
    const byId = new Map(existing.map((t) => [t.id, t]));

    // Incrementally index: add missing tracks (by path-derived id).
    for (const filePath of filePaths) {
      const id = filePath;
      if (!byId.has(id)) {
        const track = await deps.buildTrackFromPath(filePath);
        byId.set(id, track);
      }
    }

    const tracks = Array.from(byId.values()).sort(byPath);
    await deps.saveTracks(tracks);

    res.json({ roots: s.libraryRoots, files: filePaths });
  };
}
