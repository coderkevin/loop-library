import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import type { Set } from '../../../shared/types.js';
import type { ApiDeps } from '../types.js';

type CreateSetBody = {
  name?: string;
  targetBpm?: number;
  targetKey?: string;
};

function nowIso(): string {
  return new Date().toISOString();
}

export function createCreateSetHandler(deps: Pick<ApiDeps, 'loadSets' | 'saveSets'>) {
  return async function createSetHandler(req: Request, res: Response) {
    const body = req.body as CreateSetBody;
    if (!body.name || typeof body.targetBpm !== 'number') {
      res.status(400).json({ error: 'name and targetBpm are required' });
      return;
    }

    const ts = nowIso();
    const set: Set = {
      id: randomUUID(),
      name: body.name,
      targetBpm: body.targetBpm,
      targetKey: body.targetKey,
      exportDir: undefined,
      clipIds: [],
      createdAt: ts,
      updatedAt: ts,
    };

    const existing = await deps.loadSets();
    const next = [...existing, set];
    await deps.saveSets(next);
    res.json(set);
  };
}
