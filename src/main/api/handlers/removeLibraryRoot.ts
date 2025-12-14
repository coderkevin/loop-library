import type { Request, Response } from 'express';

import type { Settings } from '../../../shared/types.js';
import type { AddRemoveBody, ApiDeps } from '../types.js';

export function createRemoveLibraryRootHandler(deps: Pick<ApiDeps, 'loadSettings' | 'saveSettings'>) {
  return async function removeLibraryRootHandler(req: Request, res: Response) {
    const body = req.body as AddRemoveBody;
    if (!body.root) {
      res.status(400).json({ error: 'root is required' });
      return;
    }

    const s = await deps.loadSettings();
    const next: Settings = { ...s, libraryRoots: s.libraryRoots.filter((r) => r !== body.root) };
    await deps.saveSettings(next);
    res.json(next);
  };
}


