import { describe, expect, it, vi } from 'vitest';

import { createScanLibraryHandler } from './scanLibrary';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';
import type { Request, Response } from 'express';

describe('scanLibraryHandler', () => {
  it('scans files for current roots', async () => {
    const loadSettings = vi.fn(async () => ({ libraryRoots: ['/a'] }));
    const scanForAudioFiles = vi.fn(async () => ['/a/one.wav']);
    const handler = createScanLibraryHandler({ loadSettings, scanForAudioFiles });

    const req = createMockReq();
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(scanForAudioFiles).toHaveBeenCalledWith(['/a']);
    expect(res.jsonBody).toEqual({ roots: ['/a'], files: ['/a/one.wav'] });
  });
});


