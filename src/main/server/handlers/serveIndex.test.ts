import { describe, expect, it, vi } from 'vitest';

import { createServeIndexHandler } from './serveIndex';
import type { NextFunction, Request, Response } from 'express';

describe('serveIndexHandler', () => {
  it('sends dist/index.html', () => {
    const handler = createServeIndexHandler({ distDir: '/tmp/dist' });
    const res = { sendFile: vi.fn() };

    handler({} as unknown as Request, res as unknown as Response, (() => undefined) as NextFunction);

    expect(res.sendFile).toHaveBeenCalledWith('/tmp/dist/index.html');
  });
});


