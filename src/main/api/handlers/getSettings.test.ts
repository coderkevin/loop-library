import { describe, expect, it, vi } from 'vitest';

import { createGetSettingsHandler } from './getSettings';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';
import type { Request, Response } from 'express';

describe('getSettingsHandler', () => {
  it('returns settings as json', async () => {
    const loadSettings = vi.fn(async () => ({ libraryRoots: ['/a'] }));
    const handler = createGetSettingsHandler({ loadSettings });

    const req = createMockReq();
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(loadSettings).toHaveBeenCalledTimes(1);
    expect(res.jsonBody).toEqual({ libraryRoots: ['/a'] });
  });
});


