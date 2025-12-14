const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('loopLibrary', {
  ping: () => 'pong',
});
