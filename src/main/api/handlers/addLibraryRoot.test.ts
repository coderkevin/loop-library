import { describe, expect, it, vi } from 'vitest';

import { createAddLibraryRootHandler } from './addLibraryRoot';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';
import type { Request, Response } from 'express';

describe('addLibraryRootHandler', () => {
  it('400 when root missing', async () => {
    const handler = createAddLibraryRootHandler({
      loadSettings: vi.fn(async () => ({ libraryRoots: [] })),
      saveSettings: vi.fn(async () => undefined),
    });

    const req = createMockReq({ body: {} });
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.statusCode).toBe(400);
    expect(res.jsonBody).toEqual({ error: 'root is required' });
  });

  it('adds root and de-dupes, then persists', async () => {
    const loadSettings = vi.fn(async () => ({ libraryRoots: ['/a'] }));
    const saveSettings = vi.fn(async () => undefined);
    const handler = createAddLibraryRootHandler({ loadSettings, saveSettings });

    const req = createMockReq({ body: { root: '/a' } });
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(saveSettings).toHaveBeenCalledWith({ libraryRoots: ['/a'] });
    expect(res.jsonBody).toEqual({ libraryRoots: ['/a'] });
  });
});


