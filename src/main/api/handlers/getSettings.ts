import type { Request, Response } from 'express';

import type { ApiDeps } from '../types.js';

export function createGetSettingsHandler(deps: Pick<ApiDeps, 'loadSettings'>) {
  return async function getSettingsHandler(_req: Request, res: Response) {
    const settings = await deps.loadSettings();
    res.json(settings);
  };
}


