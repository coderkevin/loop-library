import { describe, expect, it, vi } from 'vitest';

import { createRemoveLibraryRootHandler } from './removeLibraryRoot';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';
import type { Request, Response } from 'express';

describe('removeLibraryRootHandler', () => {
  it('400 when root missing', async () => {
    const handler = createRemoveLibraryRootHandler({
      loadSettings: vi.fn(async () => ({ libraryRoots: [] })),
      saveSettings: vi.fn(async () => undefined),
    });

    const req = createMockReq({ body: {} });
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.statusCode).toBe(400);
    expect(res.jsonBody).toEqual({ error: 'root is required' });
  });

  it('removes root then persists', async () => {
    const loadSettings = vi.fn(async () => ({ libraryRoots: ['/a', '/b'] }));
    const saveSettings = vi.fn(async () => undefined);
    const handler = createRemoveLibraryRootHandler({ loadSettings, saveSettings });

    const req = createMockReq({ body: { root: '/a' } });
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(saveSettings).toHaveBeenCalledWith({ libraryRoots: ['/b'] });
    expect(res.jsonBody).toEqual({ libraryRoots: ['/b'] });
  });
});


