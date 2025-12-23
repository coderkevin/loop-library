import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import { createListClipsHandler } from './listClips';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';

describe('listClipsHandler', () => {
  it('returns clips', async () => {
    const handler = createListClipsHandler({
      loadClips: vi.fn(async () => [
        {
          id: 'c',
          trackId: 't',
          name: 'x',
          startSec: 0,
          endSec: 1,
          isLoop: false,
          createdAt: 't',
          updatedAt: 't',
        },
      ]),
    });

    const req = createMockReq();
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    const body = res.jsonBody as unknown as Array<{ id: string }>;
    expect(body[0].id).toBe('c');
  });
});
