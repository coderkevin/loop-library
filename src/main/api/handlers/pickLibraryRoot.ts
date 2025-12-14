import type { Request, Response } from 'express';

import type { ApiDeps } from '../types.js';

export function createPickLibraryRootHandler(deps: Pick<ApiDeps, 'showOpenDirectoryDialog'>) {
  return async function pickLibraryRootHandler(_req: Request, res: Response) {
    const r = await deps.showOpenDirectoryDialog();
    const isCanceled = r.canceled || r.filePaths.length === 0;
    if (isCanceled) {
      res.json({ root: null });
      return;
    }
    res.json({ root: r.filePaths[0] });
  };
}


