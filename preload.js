const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('lyceeConnect', {
  appName: 'LycéeConnect Offline'
});
