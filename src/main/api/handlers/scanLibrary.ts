import type { Request, Response } from 'express';

import type { ApiDeps } from '../types.js';

export function createScanLibraryHandler(deps: Pick<ApiDeps, 'loadSettings' | 'scanForAudioFiles'>) {
  return async function scanLibraryHandler(_req: Request, res: Response) {
    const s = await deps.loadSettings();
    const files = await deps.scanForAudioFiles(s.libraryRoots);
    res.json({ roots: s.libraryRoots, files });
  };
}


