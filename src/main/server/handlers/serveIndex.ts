import path from 'node:path';
import type { RequestHandler } from 'express';

export function createServeIndexHandler({ distDir }: { distDir: string }) {
  const handler: RequestHandler = (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  };
  return handler;
}


