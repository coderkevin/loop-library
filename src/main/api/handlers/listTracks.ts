import type { Request, Response } from 'express';

import type { ApiDeps } from '../types.js';

export function createListTracksHandler(deps: Pick<ApiDeps, 'loadTracks'>) {
  return async function listTracksHandler(_req: Request, res: Response) {
    res.json(await deps.loadTracks());
  };
}
