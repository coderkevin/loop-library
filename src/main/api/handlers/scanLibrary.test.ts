import { describe, expect, it, vi } from 'vitest';

import { createScanLibraryHandler } from './scanLibrary';
import { createMockReq, createMockRes } from '../testUtils/mockReqRes';
import type { Request, Response } from 'express';

describe('scanLibraryHandler', () => {
  it('scans files for current roots', async () => {
    const loadSettings = vi.fn(async () => ({ libraryRoots: ['/a'] }));
    const scanForAudioFiles = vi.fn(async () => ['/a/one.wav']);
    const loadTracks = vi.fn(async () => []);
    const saveTracks = vi.fn(async () => undefined);
    const buildTrackFromPath = vi.fn(async (p: string) => ({
      id: p,
      path: p,
      createdAt: 't',
      updatedAt: 't',
    }));

    const handler = createScanLibraryHandler({
      loadSettings,
      scanForAudioFiles,
      loadTracks,
      saveTracks,
      buildTrackFromPath,
    });

    const req = createMockReq();
    const res = createMockRes();

    await handler(req as unknown as Request, res as unknown as Response);

    expect(scanForAudioFiles).toHaveBeenCalledWith(['/a']);
    expect(saveTracks).toHaveBeenCalledTimes(1);
    expect(res.jsonBody).toEqual({ roots: ['/a'], files: ['/a/one.wav'] });
  });
});
