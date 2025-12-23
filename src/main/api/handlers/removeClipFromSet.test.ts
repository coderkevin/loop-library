import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import { createRemoveClipFromSetHandler } from './removeClipFromSet';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';

describe('removeClipFromSetHandler', () => {
  it('400 when missing fields', async () => {
    const handler = createRemoveClipFromSetHandler({
      loadSets: vi.fn(async () => []),
      saveSets: vi.fn(async () => undefined),
    });

    const req = createMockReq({ body: {} });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);
    expect(res.statusCode).toBe(400);
  });

  it('404 when set missing', async () => {
    const handler = createRemoveClipFromSetHandler({
      loadSets: vi.fn(async () => []),
      saveSets: vi.fn(async () => undefined),
    });

    const req = createMockReq({ body: { setId: 's', clipId: 'c' } });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);
    expect(res.statusCode).toBe(404);
  });

  it('removes clip id and persists', async () => {
    const saveSets = vi.fn(async () => undefined);
    const handler = createRemoveClipFromSetHandler({
      loadSets: vi.fn(async () => [
        { id: 's', name: 'n', targetBpm: 120, clipIds: ['c'], createdAt: 't', updatedAt: 't' },
      ]),
      saveSets,
    });

    const req = createMockReq({ body: { setId: 's', clipId: 'c' } });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    expect(saveSets).toHaveBeenCalledTimes(1);
    expect(res.jsonBody).toEqual({ setId: 's', clipId: 'c' });
  });
});
