const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('lyceeConnect', {
  appName: 'LycéeConnect Offline',
  database: {
    getDashboardStats: () => ipcRenderer.invoke('database:get-dashboard-stats')
  }
});
