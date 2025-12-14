import { app, BrowserWindow } from 'electron';
import { startServer, stopServer } from './server.js';

type RunMode = 'browser' | 'electron';
const runMode = (process.env.LOOP_LIBRARY_MODE ?? 'browser') as RunMode;
const openDevTools = process.env.ELECTRON_DEVTOOLS === 'true';

function createWindow(url: string) {
  console.log('[main] creating window');
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('[main] renderer did-fail-load', { errorCode, errorDescription, validatedURL });
  });

  void win.loadURL(url);

  if (openDevTools) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  win.on('closed', () => {
    if (runMode === 'electron') {
      void stopServer().finally(() => {
        app.quit();
      });
    }
  });
}

app.whenReady().then(() => {
  console.log('[main] app.whenReady()');

  const serverIsDev = runMode === 'browser';
  void startServer({ isDev: serverIsDev }).then(({ url }) => {
    console.log(`[main] API ready at ${url}`);

    if (runMode === 'browser') {
      console.log('[main] Open UI at http://localhost:5173');
      return; // browser-dev mode: no Electron window
    }
    createWindow(url);
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void startServer({ isDev: serverIsDev }).then(({ url }) => createWindow(url));
    }
  });
});

app.on('window-all-closed', () => {
  if (runMode === 'electron') {
    void stopServer().finally(() => {
      app.quit();
    });
    return;
  }

  if (process.platform !== 'darwin') {
    app.quit();
  }
});
