const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");

const { expressApp } = require("./express");

const mockFilesStoragePath = app.getPath("userData");

expressApp(mockFilesStoragePath);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "/public/mockAppIcon.png"),
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.maximize();
  isDev && mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));
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

app.on("ready", function () {
  autoUpdater.checkForUpdatesAndNotify();
});
