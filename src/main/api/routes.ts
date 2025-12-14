import type { Express } from 'express';

import { createAddLibraryRootHandler } from './handlers/addLibraryRoot.js';
import { createGetSettingsHandler } from './handlers/getSettings.js';
import { createPickLibraryRootHandler } from './handlers/pickLibraryRoot.js';
import { createRemoveLibraryRootHandler } from './handlers/removeLibraryRoot.js';
import { createScanLibraryHandler } from './handlers/scanLibrary.js';
import type { ApiDeps } from './types.js';

export function registerApiRoutes(app: Express, deps: ApiDeps) {
  app.get('/api/settings', createGetSettingsHandler(deps));
  app.post('/api/libraryRoots/pick', createPickLibraryRootHandler(deps));
  app.post('/api/libraryRoots/add', createAddLibraryRootHandler(deps));
  app.post('/api/libraryRoots/remove', createRemoveLibraryRootHandler(deps));
  app.post('/api/library/scan', createScanLibraryHandler(deps));
}


