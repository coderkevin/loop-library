import { dialog, ipcMain } from 'electron';

import { scanForAudioFiles } from './libraryScan.js';
import { loadSettings, saveSettings } from './settings.js';
import { createIpcHandlers } from './ipcHandlers.js';

import type { IpcDeps } from './ipcHandlers.js';

export function registerIpcHandlers() {
  const deps: IpcDeps = {
    loadSettings,
    saveSettings,
    scanForAudioFiles,
    showOpenDirectoryDialog: () => dialog.showOpenDialog({ properties: ['openDirectory'] }),
  };

  const handlers = createIpcHandlers(deps);

  ipcMain.handle('settings:get', handlers.handleGetSettings);
  ipcMain.handle('libraryRoots:pick', handlers.handlePickLibraryRoot);
  ipcMain.handle('libraryRoots:add', handlers.handleAddLibraryRoot);
  ipcMain.handle('libraryRoots:remove', handlers.handleRemoveLibraryRoot);
  ipcMain.handle('library:scan', handlers.handleScanLibrary);
}
