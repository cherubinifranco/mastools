export async function loadTemplateDataFromXlsx(xlsxFile) {
  if (xlsxFile == "" || xlsxFile == null || xlsxFile == undefined) {
    return false;
  }
  const loadedData = await window.electronAPI.getSampleDataXlsx(xlsxFile);

  return loadedData;
}

export function arrayToObj(array) {
  const resObj = {};
  array.forEach((el) => {
    resObj[el[0]] = el[1];
  });

  return resObj;
}
export function objToArrayOfEntries(obj) {
  const resArray = Object.keys(obj);
  return resArray;
}

export function applyTemplate(message, obj) {
  const newObj = {
    ...obj,
  };
  for (const key in newObj) {
    const lookup = new RegExp(`{${key}}`, "g");
    const value = newObj[key];
    if (lookup.test(message)) {
      message = message.replace(lookup, value);
    }
  }
  return message;
}

export async function getDir() {
  const folderPath = await window.electronAPI.getFolder();
  if (folderPath == undefined) return "";
  return folderPath;
}
export async function getFile() {
  const filePath = await window.electronAPI.getFile();
  if (filePath == undefined) return "";
  return filePath;
}
export async function nofify(notificationInfo) {
  window.electronAPI.nofify(notificationInfo)
}
async function verifyMailInfo(mailInfo) {
  if (
    [mailInfo.mailConfig.mail, mailInfo.mailConfig.password].some(
      (x) => x == undefined || x == ""
    )
  ) {
    return "Mail no definido";
  }

  if (mailInfo.xlsxFile == undefined || mailInfo.xlsxFile == "") {
    return "XLSX no definido";
  }

  if (
    [mailInfo.title, mailInfo.message].some((x) => x == undefined || x == "")
  ) {
    return "Mensaje o Titulo no definido";
  }

  return false;
}

export async function displayDialog(info) {
  await window.electronAPI.showDialog(info);
}

export async function sendTicket(mailInfo) {
  const skip = await verifyMailInfo(mailInfo);
  if (skip) return skip;

  window.electronAPI.sendTicket(mailInfo);

  await displayDialog(supportSucces);
}

export async function sendMails(mailInfo) {
  const skip = await verifyMailInfo(mailInfo);
  if (skip) return skip;

  const [errors, sendedMails] = await window.electronAPI.sendMailsInfo(
    mailInfo
  );
  addSended(sendedMails.length)
  return [errors, sendedMails];
}

export async function sendReports(mailInfo) {
  const skip = await verifyMailInfo(mailInfo);
  if (mailInfo.pdfPath == "") {
    return "Carpeta de PDFS no seleccionada";
  }
  if (mailInfo.facturasPath == "") {
    return "Carpeta de Facturas no seleccionada";
  }
  if (skip) return skip;

  const date = new Date();
  const lastSend = [date.toLocaleDateString(), date.toLocaleTimeString()];
  const [errors, sendedReports] = await window.electronAPI.sendReportInfo(
    mailInfo
  );
  addSended(sendedReports.length)
  return [errors, sendedReports, lastSend];
}

export async function fetchAllData(xlsxFile) {
  const jsonData = await window.electronAPI.fetchAllData(xlsxFile);

  return jsonData;
}

export async function getAudit() {
  const auditLS = JSON.parse(window.localStorage.getItem("auditArray")) ?? [];
  return auditLS;
}

export async function addAudit(newAudit) {
  const auditLS = JSON.parse(localStorage.getItem("auditArray")) ?? [];
  const date = await getDate();
  newAudit.timeStamp = date.day + "/" + date.month + "/" + date.year + " " + date.time;
  auditLS.unshift(newAudit);
  localStorage.setItem("auditArray", JSON.stringify(auditLS));
}

export async function getDate() {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours()
  let minutes = date.getMinutes();
  let time = hours + ":" + minutes 

  return { day, month, year, time };
}

export const addSended = (add) => {
  const totalSended = JSON.parse(localStorage.getItem("totalSended")) ?? 0;
  const newTotalSended = totalSended + add;
  localStorage.setItem("totalSended", newTotalSended)
}