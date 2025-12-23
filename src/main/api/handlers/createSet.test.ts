import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import { createCreateSetHandler } from './createSet';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';

describe('createSetHandler', () => {
  it('400 when required fields missing', async () => {
    const handler = createCreateSetHandler({
      loadSets: vi.fn(async () => []),
      saveSets: vi.fn(async () => undefined),
    });

    const req = createMockReq({ body: { name: 'x' } });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.statusCode).toBe(400);
  });

  it('creates and persists a set', async () => {
    const saveSets = vi.fn(async () => undefined);
    const handler = createCreateSetHandler({
      loadSets: vi.fn(async () => []),
      saveSets,
    });

    const req = createMockReq({ body: { name: 'MySet', targetBpm: 130, targetKey: 'Amin' } });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.statusCode).toBeNull();
    const body = res.jsonBody as unknown as { name?: string };
    expect(body.name).toBe('MySet');
    expect(saveSets).toHaveBeenCalledTimes(1);
  });
});
