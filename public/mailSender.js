const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const Mail = require("nodemailer/lib/mailer");

function applyTemplate(message, obj, ownVariables) {
  const newObj = {
    ...obj,
    ...ownVariables,
  };
  for (const key in newObj) {
    const lookup = new RegExp(`{${key}}`, "g");
    const lookup2 = new RegExp(`\n`, "g");
    const value = newObj[key];
    if (lookup.test(message)) {
      message = message.replace(lookup, value);
      message = message.replace(lookup2, "<br />");
    }
  }
  return message;
}

const pushErrors = (errorsArray, cellId, mail, error) => {
  errorsArray.push({ cellId: cellId, mail, error });
};

async function sendMailsToClients(clientData, mailContent, ownVariables) {
  // Transporter config
  const SERVICE = mailContent.mailConfig.service || "gmail";
  const HOST = mailContent.mailConfig.host || "smtp.gmail.com";
  const MAIL = mailContent.mailConfig.mail;
  const PASSWORD = mailContent.mailConfig.password;
  const ExtraFile = mailContent.files;
  
  const transporter = nodemailer.createTransport({
    host: HOST,
    port: 587,
    secure: false,
    service: SERVICE,
    auth: {
      user: MAIL,
      pass: PASSWORD,
    },
  });

  const errors = [];
  const sendedMails = [];

  for (const entry of clientData) {
    let skip = false;
    const mail =
      entry.Email ||
      entry.email ||
      entry.Mail ||
      entry.mail ||
      entry.Correo ||
      entry.correo ||
      "";
    const cellId = "A" + entry.xlsxCellId;

    // This is made with "skip" to give room in case of expansion in error checking and details

    if (mail == "") {
      pushErrors(errors, cellId, mail, "Mail no definido");
      skip = true;
    }

    if (skip) {
      continue;
    }

    let content = applyTemplate(mailContent.message, entry, ownVariables);

    let mailOptions = {
      from: `MAS INGENIERIA <${mail}>`,
      to: mail,
      subject: mailContent.title,
      html: content,
      attachments: ExtraFile
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      sendedMails.push({ cellId: cellId, mail: mail, mailId: info.messageId });
    } catch (error) {
      pushErrors(
        errors,
        cellId,
        mail,
        "Error de email. Verificar dirección y reintentar"
      );
    }
  }
  return [errors, sendedMails];
}

async function sendReportsToClients(clientData, mailContent, ownVariables) {
  // Transporter config
  const SERVICE = mailContent.mailConfig.service || "gmail";
  const HOST = mailContent.mailConfig.host || "smtp.gmail.com";
  const MAIL = mailContent.mailConfig.mail;
  const PASSWORD = mailContent.mailConfig.password;
  const CARPETA_PDFS = mailContent.pdfPath;
  const CARPETA_FACTURAS = mailContent.facturasPath;
  const ABONO_MIN = mailContent.abonoMin;

  const transporter = nodemailer.createTransport({
    host: HOST,
    port: 587,
    secure: false,
    service: SERVICE,
    auth: {
      user: MAIL,
      pass: PASSWORD,
    },
  });

  const errores = [];
  const sendedMails = [];

  for (const entry of clientData) {
    const NUM_CUENTA =
      entry.numCuenta ||
      entry.numeroCuenta ||
      entry.cuenta ||
      entry.Cuenta ||
      null;
    const ABONO = entry.abono || entry.Abono || null;
    const FACTURA =
      entry.factura || entry.Factura || entry.fac || entry.Fac || false;

    const pathPDF = path.join(`${CARPETA_PDFS}`, `${NUM_CUENTA}.pdf`);
    const pathFactura = path.join(`${CARPETA_FACTURAS}`, `${NUM_CUENTA}.pdf`);

    const mail =
      entry.Email ||
      entry.email ||
      entry.Mail ||
      entry.mail ||
      entry.Correo ||
      entry.correo ||
      "";
    const cellId = "A" + entry.xlsxCellId;
    // Checking posible errors
    let skip = false;

    if (ABONO < ABONO_MIN) {
      pushErrors(
        errores,
        NUM_CUENTA,
        mail,
        "Abono menor al minimo establecido"
      );
      skip = true;
    }
    if (mail == "") {
      pushErrors(errores, NUM_CUENTA, mail, "Mail no definido");
      skip = true;
    }
    if (!fs.existsSync(pathPDF)) {
      pushErrors(errores, NUM_CUENTA, mail, "Falta PDF");
      skip = true;
    }
    if (FACTURA && !fs.existsSync(pathFactura)) {
      pushErrors(errores, NUM_CUENTA, mail, "Falta factura");
      skip = true;
    }

    if (skip) {
      continue;
    }

    let content = applyTemplate(mailContent.message, entry, ownVariables);

    let mailOptions = {
      from: `MAS INGENIERIA <${mail}>`,
      to: mail,
      subject: mailContent.title,
      html: content,
      attachments: [
        {
          filename: "resumen.pdf",
          path: pathPDF,
        },
      ],
    };

    if (FACTURA == "A" || FACTURA == "B") {
      mailOptions.attachments.push({
        filename: "factura.pdf",
        path: pathFactura,
      });
    }

    try {
      const info = await transporter.sendMail(mailOptions);
      sendedMails.push({ cellId: NUM_CUENTA, mail, id: info.messageId });
    } catch (error) {
      pushErrors(
        errores,
        NUM_CUENTA,
        mail,
        "Error de email. Verificar dirección y reintentar"
      );
    }
  }
  return [errores, sendedMails];
}

module.exports = { sendReportsToClients, sendMailsToClients };
