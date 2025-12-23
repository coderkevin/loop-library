import type { Express } from 'express';

import { createAddLibraryRootHandler } from './handlers/addLibraryRoot.js';
import { createAddClipToSetHandler } from './handlers/addClipToSet.js';
import { createCreateClipHandler } from './handlers/createClip.js';
import { createCreateSetHandler } from './handlers/createSet.js';
import { createExportSetHandler } from './handlers/exportSet.js';
import { createGetSettingsHandler } from './handlers/getSettings.js';
import { createListClipsHandler } from './handlers/listClips.js';
import { createListSetsHandler } from './handlers/listSets.js';
import { createListTracksHandler } from './handlers/listTracks.js';
import { createPickSetExportDirHandler } from './handlers/pickSetExportDir.js';
import { createPickLibraryRootHandler } from './handlers/pickLibraryRoot.js';
import { createRemoveLibraryRootHandler } from './handlers/removeLibraryRoot.js';
import { createRemoveClipFromSetHandler } from './handlers/removeClipFromSet.js';
import { createScanLibraryHandler } from './handlers/scanLibrary.js';
import type { ApiDeps } from './types.js';

export function registerApiRoutes(app: Express, deps: ApiDeps) {
  app.get('/api/settings', createGetSettingsHandler(deps));
  app.get('/api/tracks', createListTracksHandler(deps));
  app.get('/api/clips', createListClipsHandler(deps));
  app.get('/api/sets', createListSetsHandler(deps));

  app.post('/api/libraryRoots/pick', createPickLibraryRootHandler(deps));
  app.post('/api/libraryRoots/add', createAddLibraryRootHandler(deps));
  app.post('/api/libraryRoots/remove', createRemoveLibraryRootHandler(deps));
  app.post('/api/library/scan', createScanLibraryHandler(deps));

  app.post('/api/clips/create', createCreateClipHandler(deps));
  app.post('/api/sets/create', createCreateSetHandler(deps));
  app.post('/api/sets/pickExportDir', createPickSetExportDirHandler(deps));
  app.post('/api/sets/addClip', createAddClipToSetHandler(deps));
  app.post('/api/sets/removeClip', createRemoveClipFromSetHandler(deps));
  app.post('/api/sets/export', createExportSetHandler(deps));
}
