const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { Notification } = require("electron");

const { sendReportsToClients, sendMailsToClients } = require("./mailSender");
const { fetchDataFromXLSX, fetchSampleDataFromXLSX } = require("./fetchData");

const { autoUpdater } = require("electron-updater");

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow;
const DEVELOPMENT = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minHeight: 500,
    minWidth: 520,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "/preload.js"),
      devTools: true,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  const windowURL = DEVELOPMENT
    ? "http://localhost:3000/"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  if (DEVELOPMENT) {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.loadURL(windowURL);
  ipcMain.on("closeApp", () => {
    mainWindow.close();
  });
  ipcMain.on("maxResApp", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on("minimizeApp", () => {
    mainWindow.minimize();
  });

  ipcMain.on("showDialog", async (event, dialogInfo) => {
    dialog.showMessageBox(mainWindow, dialogInfo);
  });

  ipcMain.handle("selectDirectory", async function () {
    let dir = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    return dir.filePaths[0];
  });

  ipcMain.handle("selectFile", async function () {
    let file = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
    });

    return file.filePaths[0];
  });

  ipcMain.handle("getSampleData", async (event, xlsxFile) => {
    const sampleData = await fetchSampleDataFromXLSX(xlsxFile);
    return sampleData;
  });

  ipcMain.handle("fetchAllData", async (event, xlsxFile) => {
    const data = await fetchDataFromXLSX(xlsxFile);
    return data;
  });

  ipcMain.handle("sendMails", async (event, mailInfo) => {
    const clientData = await fetchDataFromXLSX(mailInfo.xlsxFile);
    let ownVariablesLS = await mainWindow.webContents.executeJavaScript(
      'localStorage.getItem("ownVariables");',
      true
    );
    const ownVariables = {};
    if (ownVariablesLS == undefined) ownVariablesLS = "[]";
    ownVariablesLS = JSON.parse(ownVariablesLS);
    ownVariablesLS.forEach((el) => {
      ownVariables[el[0]] = el[1];
    });
    const data = await sendMailsToClients(clientData, mailInfo, ownVariables);
    return data;
  });

  ipcMain.handle("sendReports", async (event, mailInfo) => {
    const clientData = await fetchDataFromXLSX(mailInfo.xlsxFile);
    let ownVariablesLS = await mainWindow.webContents.executeJavaScript(
      'localStorage.getItem("ownVariables");',
      true
    );
    const ownVariables = {};
    if (ownVariablesLS == undefined) ownVariablesLS = "[]";
    ownVariablesLS = JSON.parse(ownVariablesLS);
    ownVariablesLS.forEach((el) => {
      ownVariables[el[0]] = el[1];
    });
    const data = await sendReportsToClients(clientData, mailInfo, ownVariables);
    return data;
  });

  ipcMain.handle("sendTicket", async (event, mailInfo) => {
    const supportData = [
      {
        mail: "cherubini.franco@hotmail.com",
      },
    ];
    const data = await sendMailsToClients(supportData, mailInfo);
    return data; // [errores, sendedMails]
  });
}

app.whenReady().then(() => {
  app.setAppUserModelId("Mas Tools")
  createWindow();
  setTimeout(() => {
    autoUpdater.checkForUpdates();
    if(DEVELOPMENT){
      showNotification("Test Notification", "Notiications works as expected")
    }
  }, "3000");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


ipcMain.on('notification', (event, {title, body}) => {
  showNotification(title, body)
});


autoUpdater.on("update-available", (info) => {
  autoUpdater.downloadUpdate();
  showNotification("Update detected", "Downloading the latest features.")
});

autoUpdater.on("update-not-available", (info) => {
  console.log(info);
});


autoUpdater.on('download-progress', (progress) => {
  const percentage = progress.percent / 100;
  updateTaskbarProgress(percentage);
});

autoUpdater.on("update-downloaded", (info) => {
  mainWindow.setProgressBar(-1);
  showNotification("Installation Complete", "Please restart the app to finish updating.")
});

autoUpdater.on("error", (info) => {
  if(replyUpdate){
    showNotification("No updates found", "Good news! You’re already on the newest version.")
  }
  console.log(info);
});


function showNotification(title, body) {
  new Notification({
    title: title,
    body: body,
    icon: path.join(__dirname, '../icon.png')
  }).show();
}