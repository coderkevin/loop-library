import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const isDev = process.env.ELECTRON_DEV === 'true';
const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? 'http://localhost:5173/';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadDevServer(win: BrowserWindow, attemptsLeft = 40): Promise<void> {
  try {
    await win.loadURL(devServerUrl);
  } catch (err) {
    if (attemptsLeft <= 0) throw err;
    await new Promise((r) => setTimeout(r, 250));
    return loadDevServer(win, attemptsLeft - 1);
  }
}

function createWindow() {
  if (isDev) {
    console.log('[main] creating window (dev)');
  }
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  win.webContents.on('did-finish-load', () => {
    console.log('[main] renderer did-finish-load');

    // Sanity check: verify preload exposed API is visible in the main world.
    void win.webContents
      .executeJavaScript('window.loopLibrary?.ping?.()')
      .then((result) => {
        console.log('[main] window.loopLibrary.ping()', result ?? '(undefined)');
      })
      .catch((err) => {
        console.error('[main] window.loopLibrary.ping() threw', err);
      });
  });

  win.webContents.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL) => {
    console.error('[main] renderer did-fail-load', { errorCode, errorDescription, validatedURL });
  });

  if (isDev) {
    void loadDevServer(win);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  if (isDev) {
    console.log('[main] app.whenReady()');
  }
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
