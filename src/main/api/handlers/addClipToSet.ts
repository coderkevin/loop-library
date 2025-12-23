import type { Request, Response } from 'express';

import type { ApiDeps } from '../types.js';

type AddClipToSetBody = { setId?: string; clipId?: string };

function nowIso(): string {
  return new Date().toISOString();
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function createAddClipToSetHandler(deps: Pick<ApiDeps, 'loadSets' | 'saveSets'>) {
  return async function addClipToSetHandler(req: Request, res: Response) {
    const body = req.body as AddClipToSetBody;
    if (!body.setId || !body.clipId) {
      res.status(400).json({ error: 'setId and clipId are required' });
      return;
    }

    const sets = await deps.loadSets();
    const exists = sets.some((s) => s.id === body.setId);
    if (!exists) {
      res.status(404).json({ error: 'set not found' });
      return;
    }

    const ts = nowIso();
    const next = sets.map((s) =>
      s.id === body.setId
        ? { ...s, clipIds: uniq([...s.clipIds, body.clipId!]), updatedAt: ts }
        : s,
    );
    await deps.saveSets(next);
    res.json({ setId: body.setId, clipId: body.clipId });
  };
}
