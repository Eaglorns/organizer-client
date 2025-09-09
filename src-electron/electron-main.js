import {
  app,
  BrowserWindow,
  nativeTheme,
  Menu,
  Tray,
  dialog,
  ipcMain,
  Notification,
  screen,
} from 'electron'
import electronUpdater from 'electron-updater'
const { autoUpdater } = electronUpdater
import { initialize, enable } from '@electron/remote/main/index.js'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true

const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

initialize()

let mainWindow

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: width,
    height: height,
    useContentSize: true,
    frame: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION
        )
      ),
    },
  })

  if (process.env.DEV) {
    mainWindow.loadURL(process.env.APP_URL)
  } else {
    mainWindow.loadFile('index.html')
  }

  mainWindow.removeMenu()

  enable(mainWindow.webContents)

  if (process.env.DEV) {
    mainWindow.loadURL(process.env.APP_URL)
  } else {
    mainWindow.loadFile('index.html')
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
    //mainWindow.webContents.closeDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('minimize', (event) => {
    event.preventDefault()
    mainWindow.minimize()
  })

  mainWindow.on('close', (event) => {
    event.preventDefault()
    mainWindow.minimize()
  })
}

let tray = null

app
  .whenReady()
  .then(createWindow)
  .then(() => {
    tray = new Tray(path.resolve(currentDir, 'icons/icon.png'))
    tray.setToolTip('Органайзер')
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Выйти из приложения',
        click: function () {
          try {
            app.exit()
            tray.destroy()
            mainWindow.destroy()
            tray = null
            mainWindow = null
          } catch {}
        },
      },
    ])
    tray.setContextMenu(contextMenu)
    tray.setIgnoreDoubleClickEvents(true)
    tray.on('click', function (e) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    })
    autoUpdater.checkForUpdates()
  })

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

if (app.isPackaged) {
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Перезагрузить'],
      title: 'Обновление приложения Органайзер ВКС',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail:
        'Загружена новая версия приложения. Необходима перезагрузка приложения для установки обновления.',
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        setTimeout(() => {
          autoUpdater.quitAndInstall(true, true)
        }, 6000)
        tray.destroy()
        mainWindow.destroy()
        tray = null
        mainWindow = null
      }
    })
  })

  autoUpdater.on('error', (message) => {
    console.error('Возникла проблема при обновлении приложения.')
    console.error(message)
  })
}

ipcMain.on('checkUpdate', () => {
  autoUpdater.checkForUpdates()
})

ipcMain.on('notify', () => {
  try {
    const notify = new Notification({
      title: 'Событие',
      body: '',
      timeoutType: 'never',
    })
    notify.show()
  } catch (err) {
    console.log(err)
  }
})
