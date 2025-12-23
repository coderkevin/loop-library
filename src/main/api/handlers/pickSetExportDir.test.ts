import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';

import { createPickSetExportDirHandler } from './pickSetExportDir';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';

describe('pickSetExportDirHandler', () => {
  it('400 when setId missing', async () => {
    const handler = createPickSetExportDirHandler({
      loadSets: vi.fn(async () => []),
      saveSets: vi.fn(async () => undefined),
      showOpenDirectoryDialog: vi.fn(async () => ({ canceled: true, filePaths: [] })),
    });

    const req = createMockReq({ body: {} });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);
    expect(res.statusCode).toBe(400);
  });

  it('returns null when canceled', async () => {
    const handler = createPickSetExportDirHandler({
      loadSets: vi.fn(async () => [
        { id: 's', name: 'n', targetBpm: 120, clipIds: [], createdAt: 't', updatedAt: 't' },
      ]),
      saveSets: vi.fn(async () => undefined),
      showOpenDirectoryDialog: vi.fn(async () => ({ canceled: true, filePaths: [] })),
    });

    const req = createMockReq({ body: { setId: 's' } });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.jsonBody).toEqual({ setId: 's', exportDir: null });
  });

  it('updates set exportDir when selected', async () => {
    const saveSets = vi.fn(async () => undefined);
    const handler = createPickSetExportDirHandler({
      loadSets: vi.fn(async () => [
        { id: 's', name: 'n', targetBpm: 120, clipIds: [], createdAt: 't', updatedAt: 't' },
      ]),
      saveSets,
      showOpenDirectoryDialog: vi.fn(async () => ({ canceled: false, filePaths: ['/out'] })),
    });

    const req = createMockReq({ body: { setId: 's' } });
    const res = createMockRes();
    await handler(req as unknown as Request, res as unknown as Response);

    expect(saveSets).toHaveBeenCalledTimes(1);
    expect(res.jsonBody).toEqual({ setId: 's', exportDir: '/out' });
  });
});
