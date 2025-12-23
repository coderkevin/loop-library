import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import { createCreateClipHandler } from './createClip';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';

describe('createClipHandler', () => {
  it('400 when required fields missing', async () => {
    const handler = createCreateClipHandler({
      loadClips: vi.fn(async () => []),
      saveClips: vi.fn(async () => undefined),
    });

    const req = createMockReq({ body: { name: 'x' } });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.statusCode).toBe(400);
  });

  it('creates and persists a clip', async () => {
    const saveClips = vi.fn(async () => undefined);
    const handler = createCreateClipHandler({
      loadClips: vi.fn(async () => []),
      saveClips,
    });

    const req = createMockReq({
      body: { trackId: 't1', name: 'intro', startSec: 0, endSec: 4, isLoop: true },
    });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    const body = res.jsonBody as unknown as { trackId?: string; name?: string };
    expect(body.trackId).toBe('t1');
    expect(body.name).toBe('intro');
    expect(saveClips).toHaveBeenCalledTimes(1);
  });
});
