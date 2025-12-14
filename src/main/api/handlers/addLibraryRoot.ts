import type { Request, Response } from 'express';

import type { Settings } from '../../../shared/types.js';
import type { AddRemoveBody, ApiDeps } from '../types.js';

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function createAddLibraryRootHandler(deps: Pick<ApiDeps, 'loadSettings' | 'saveSettings'>) {
  return async function addLibraryRootHandler(req: Request, res: Response) {
    const body = req.body as AddRemoveBody;
    if (!body.root) {
      res.status(400).json({ error: 'root is required' });
      return;
    }

    const s = await deps.loadSettings();
    const next: Settings = { ...s, libraryRoots: uniq([...s.libraryRoots, body.root]) };
    await deps.saveSettings(next);
    res.json(next);
  };
}


