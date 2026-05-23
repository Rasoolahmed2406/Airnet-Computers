const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { URL } = require('url');

// Keep a global reference to prevent garbage collection
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Airnet Computers',
    icon: path.join(__dirname, '../public/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: true,
    },
    backgroundColor: '#fafbfc',
    show: false, // Don't show until ready
  });

  // Load the live Vercel app
  mainWindow.loadURL('https://airnetcomputer.vercel.app/');

  // Show window once ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links in browser, not in Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith('https://airnetcomputer.vercel.app')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('https://airnetcomputer.vercel.app')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
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
