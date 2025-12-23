import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ApiDeps } from './api/types.js';
import { scanForAudioFiles } from './libraryScan.js';
import { buildTrackFromPath } from './library/indexTracks.js';
import { createApp } from './server/createApp.js';
import { createStartServer } from './server/startServer.js';
import type { ServerHandle } from './server/startServer.js';
import { loadSettings, saveSettings } from './settings.js';
import {
  loadClipsStore,
  loadPreparedClipsStore,
  loadSetsStore,
  loadTracksStore,
  saveClipsStore,
  savePreparedClipsStore,
  saveSetsStore,
  saveTracksStore,
} from './storage/stores.js';

const HOST = process.env.LOOP_LIBRARY_HOST ?? '127.0.0.1';
const PORT = Number(process.env.LOOP_LIBRARY_PORT ?? '3123');

function getProjectRootFromHere(): string {
  // Compiled path: dist-electron/main/prodServer.js
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // dist-electron/main -> dist-electron -> projectRoot
  return path.resolve(__dirname, '..', '..');
}

function getDistDir(): string {
  // Vite build output lives at <projectRoot>/dist
  return path.join(getProjectRootFromHere(), 'dist');
}

const listen = async (
  app: import('express').Express,
  port: number,
  host: string,
): Promise<ServerHandle> => {
  const server: import('node:http').Server = await new Promise((resolve, reject) => {
    const s = app.listen(port, host, () => resolve(s));
    s.on('error', reject);
  });
  return {
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      }),
  };
};

const serverLifecycle = createStartServer({ host: HOST, port: PORT, listen });

async function main(): Promise<void> {
  const deps: ApiDeps = {
    loadSettings,
    saveSettings,
    scanForAudioFiles,
    // Server-only mode: no OS picker; callers can use "Add library root" with a path instead.
    showOpenDirectoryDialog: async () => ({ canceled: true, filePaths: [] }),
    loadTracks: loadTracksStore,
    saveTracks: saveTracksStore,
    buildTrackFromPath,
    loadClips: loadClipsStore,
    saveClips: saveClipsStore,
    loadSets: loadSetsStore,
    saveSets: saveSetsStore,
    loadPreparedClips: loadPreparedClipsStore,
    savePreparedClips: savePreparedClipsStore,
  };

  const distDir = getDistDir();
  const { url } = await serverLifecycle.startServer({
    createApp: () => createApp({ isDev: false, deps, distDir }),
  });
  console.log(`[prodServer] listening at ${url}`);
}

void main();


