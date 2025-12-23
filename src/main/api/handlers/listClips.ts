import type { Request, Response } from 'express';

import type { ApiDeps } from '../types.js';

export function createListClipsHandler(deps: Pick<ApiDeps, 'loadClips'>) {
  return async function listClipsHandler(_req: Request, res: Response) {
    res.json(await deps.loadClips());
  };
}
