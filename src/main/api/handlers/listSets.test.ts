import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import { createListSetsHandler } from './listSets';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';

describe('listSetsHandler', () => {
  it('returns sets', async () => {
    const handler = createListSetsHandler({
      loadSets: vi.fn(async () => [
        { id: 's', name: 'n', targetBpm: 120, clipIds: [], createdAt: 't', updatedAt: 't' },
      ]),
    });

    const req = createMockReq();
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    const body = res.jsonBody as unknown as Array<{ id: string }>;
    expect(body[0].id).toBe('s');
  });
});
