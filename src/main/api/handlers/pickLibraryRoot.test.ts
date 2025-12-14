import { describe, expect, it, vi } from 'vitest';

import { createPickLibraryRootHandler } from './pickLibraryRoot';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';
import type { Request, Response } from 'express';

describe('pickLibraryRootHandler', () => {
  it('returns null root when canceled', async () => {
    const showOpenDirectoryDialog = vi.fn(async () => ({ canceled: true, filePaths: [] }));
    const handler = createPickLibraryRootHandler({ showOpenDirectoryDialog });

    const req = createMockReq();
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.jsonBody).toEqual({ root: null });
  });

  it('returns first selected path when not canceled', async () => {
    const showOpenDirectoryDialog = vi.fn(async () => ({ canceled: false, filePaths: ['/music'] }));
    const handler = createPickLibraryRootHandler({ showOpenDirectoryDialog });

    const req = createMockReq();
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(res.jsonBody).toEqual({ root: '/music' });
  });
});


