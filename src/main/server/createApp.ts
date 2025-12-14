import cors from 'cors';
import express from 'express';

import { registerApiRoutes } from '../api/routes.js';
import type { ApiDeps } from '../api/types.js';
import { createServeIndexHandler } from './handlers/serveIndex.js';
import { isAllowedDevOrigin } from './originAllowlist.js';

export function createApp({
  isDev,
  deps,
  distDir,
}: {
  isDev: boolean;
  deps: ApiDeps;
  distDir: string;
}) {
  const app = express();
  app.use(express.json());

  if (isDev) {
    app.use(
      cors({
        origin(origin, cb) {
          cb(null, isAllowedDevOrigin(origin ?? undefined));
        },
      }),
    );
  }

  registerApiRoutes(app, deps);

  if (!isDev) {
    app.use(express.static(distDir));
    // Express v5 + path-to-regexp: use a regex for catch-all.
    app.get(/.*/, createServeIndexHandler({ distDir }));
  }

  return app;
}
