const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");

const { expressApp } = require("./express");

const desktopPath = app.getPath("desktop");

expressApp(desktopPath);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, "/public/mockAppIcon.png")
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  isDev && mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));

  mainWindow.once("ready-to-show", () => {
    autoUpdater.checkForUpdates();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

autoUpdater.on("update-available", info => {});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});
