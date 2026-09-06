const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { closeDatabase, getDashboardStats, initializeDatabase } = require('./database');

function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 620,
    icon: path.join(__dirname, 'assets/icons/512x512.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  window.loadFile('index.html');
}

app.whenReady().then(() => {
  initializeDatabase(app.getPath('userData'));
  ipcMain.handle('database:get-dashboard-stats', () => getDashboardStats());
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  closeDatabase();
});
