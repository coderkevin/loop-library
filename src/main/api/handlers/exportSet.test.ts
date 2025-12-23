import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import { createExportSetHandler } from './exportSet';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';

describe('exportSetHandler', () => {
  it('400 when setId missing', async () => {
    const handler = createExportSetHandler({
      loadSets: vi.fn(async () => []),
      loadClips: vi.fn(async () => []),
      loadTracks: vi.fn(async () => []),
      loadPreparedClips: vi.fn(async () => []),
      savePreparedClips: vi.fn(async () => undefined),
    });

    const req = createMockReq({ body: {} });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.statusCode).toBe(400);
  });

  it('500 when export fails (e.g. set not found)', async () => {
    const handler = createExportSetHandler({
      loadSets: vi.fn(async () => []),
      loadClips: vi.fn(async () => []),
      loadTracks: vi.fn(async () => []),
      loadPreparedClips: vi.fn(async () => []),
      savePreparedClips: vi.fn(async () => undefined),
    });

    const req = createMockReq({ body: { setId: 'missing' } });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.statusCode).toBe(500);
  });
});
