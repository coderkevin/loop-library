const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('loopLibrary', {
  ping: () => 'pong',
  getSettings: () => ipcRenderer.invoke('settings:get'),
  pickLibraryRoot: () => ipcRenderer.invoke('libraryRoots:pick'),
  addLibraryRoot: (root) => ipcRenderer.invoke('libraryRoots:add', root),
  removeLibraryRoot: (root) => ipcRenderer.invoke('libraryRoots:remove', root),
  scanLibrary: () => ipcRenderer.invoke('library:scan'),
});
