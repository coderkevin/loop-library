import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { dialog } from 'electron';

import { scanForAudioFiles } from './libraryScan.js';
import { loadSettings, saveSettings } from './settings.js';
import type { ApiDeps } from './api/types.js';
import { createApp } from './server/createApp.js';
import { createStartServer } from './server/startServer.js';
import type { ServerHandle } from './server/startServer.js';

const HOST = '127.0.0.1';
const PORT = 3123;

function getProjectRootFromHere(): string {
  // Compiled path: dist-electron/main/server.js
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

export async function startServer({ isDev }: { isDev: boolean }): Promise<{ url: string }> {
  const deps: ApiDeps = {
    loadSettings,
    saveSettings,
    scanForAudioFiles,
    showOpenDirectoryDialog: () => dialog.showOpenDialog({ properties: ['openDirectory'] }),
  };

  const distDir = getDistDir();

  return serverLifecycle.startServer({ createApp: () => createApp({ isDev, deps, distDir }) });
}

export async function stopServer(): Promise<void> {
  await serverLifecycle.stopServer();
}
