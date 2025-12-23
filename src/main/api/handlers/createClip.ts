import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import type { Clip } from '../../../shared/types.js';
import type { ApiDeps } from '../types.js';

type CreateClipBody = {
  trackId?: string;
  name?: string;
  startSec?: number;
  endSec?: number;
  isLoop?: boolean;
};

function nowIso(): string {
  return new Date().toISOString();
}

export function createCreateClipHandler(deps: Pick<ApiDeps, 'loadClips' | 'saveClips'>) {
  return async function createClipHandler(req: Request, res: Response) {
    const body = req.body as CreateClipBody;
    if (
      typeof body.trackId !== 'string' ||
      typeof body.name !== 'string' ||
      typeof body.startSec !== 'number' ||
      typeof body.endSec !== 'number' ||
      typeof body.isLoop !== 'boolean'
    ) {
      res.status(400).json({ error: 'trackId, name, startSec, endSec, and isLoop are required' });
      return;
    }

    const ts = nowIso();
    const clip: Clip = {
      id: randomUUID(),
      trackId: body.trackId,
      name: body.name,
      startSec: body.startSec,
      endSec: body.endSec,
      isLoop: body.isLoop,
      createdAt: ts,
      updatedAt: ts,
    };

    const existing = await deps.loadClips();
    const next = [...existing, clip];
    await deps.saveClips(next);
    res.json(clip);
  };
}
