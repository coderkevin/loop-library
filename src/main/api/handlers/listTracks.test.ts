import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import { createListTracksHandler } from './listTracks';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';

describe('listTracksHandler', () => {
  it('returns tracks', async () => {
    const handler = createListTracksHandler({
      loadTracks: vi.fn(async () => [{ id: 't', path: '/x', createdAt: 't', updatedAt: 't' }]),
    });

    const req = createMockReq();
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    const body = res.jsonBody as unknown as Array<{ id: string }>;
    expect(body[0].id).toBe('t');
  });
});
