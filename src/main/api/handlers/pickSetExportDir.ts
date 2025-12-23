import type { Request, Response } from 'express';

import type { ApiDeps } from '../types.js';

type PickExportDirBody = { setId?: string };

function nowIso(): string {
  return new Date().toISOString();
}

export function createPickSetExportDirHandler(
  deps: Pick<ApiDeps, 'loadSets' | 'saveSets' | 'showOpenDirectoryDialog'>,
) {
  return async function pickSetExportDirHandler(req: Request, res: Response) {
    const body = req.body as PickExportDirBody;
    if (!body.setId) {
      res.status(400).json({ error: 'setId is required' });
      return;
    }

    const r = await deps.showOpenDirectoryDialog();
    const isCanceled = r.canceled || r.filePaths.length === 0;
    if (isCanceled) {
      res.json({ setId: body.setId, exportDir: null });
      return;
    }

    const exportDir = r.filePaths[0];
    const sets = await deps.loadSets();
    const ts = nowIso();
    const next = sets.map((s) => (s.id === body.setId ? { ...s, exportDir, updatedAt: ts } : s));
    await deps.saveSets(next);
    res.json({ setId: body.setId, exportDir });
  };
}
