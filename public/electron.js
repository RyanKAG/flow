process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: __dirname + '/logo192.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // devTools: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    autoHideMenuBar: true,
    frame: false,
    maximizable: true,
  })

  const devBasePath = 'http://localhost:3000/'
  const prodBasePath = `file://${path.join(__dirname, '../build/index.html')}`
  const basePath = isDev ? devBasePath : prodBasePath

  // and load the index.html of the app.
  mainWindow.loadURL(basePath)

  // mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)

  ipcMain.on('app/minimize', () => {
    mainWindow.minimize()
  })
  ipcMain.on('app/maximize', () => {
    const isMaximized = mainWindow.isMaximized()
    isMaximized ? mainWindow.unmaximize() : mainWindow.maximize()
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('app/close', () => {
  app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
