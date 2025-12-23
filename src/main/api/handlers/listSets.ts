import type { Request, Response } from 'express';

import type { ApiDeps } from '../types.js';

export function createListSetsHandler(deps: Pick<ApiDeps, 'loadSets'>) {
  return async function listSetsHandler(_req: Request, res: Response) {
    res.json(await deps.loadSets());
  };
}
