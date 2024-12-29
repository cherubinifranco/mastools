import { useState, useEffect, Children } from "react";
import {
  getFile,
  getDir,
  loadTemplateDataFromXlsx,
  sendReports,
  addAudit,
} from "../utils";
import FormItem from "../components/FormItem";
import MailsTable from "../components/MailsTable";
import ModalSimple from "../components/ModalSimple";
import { FolderIcon, FileIcon, DatabaseIcon } from "../components/Icons";

const TYPES = {
  SUCCESS: "success",
  WARNING: "warning",
  LOADING: "loading"
}


export default function ReportesPage() {
  // Load Config
  const [mailConfig, updateMailConfig] = useState({});
  const [montoMin, updateMontoMin] = useState("");

  // Load form data => XLSX, PDFS, Facturas
  const [xlsxFile, updateXlsxFile] = useState(() => "");
  const [pdfsPath, updatePathPdfs] = useState("");
  const [facturasPath, updatePathFacturas] = useState("");

  // Load tables
  const [clientErrors, updateClientErrors] = useState(() => []);
  const [sendedMails, updateSendedMails] = useState(() => []);
  const [showModal, updateModal] = useState(false);
  const [content, updateContent] = useState(<></>);
  const [modalType, updateModalType] = useState("warning");

  useEffect(() => {
    const mailConfigLS = JSON.parse(localStorage.getItem("mailConfig")) || {};
    const clientErrorsLS =
      JSON.parse(localStorage.getItem("clientErrors")) || [];
    const sendedMailsLS = JSON.parse(localStorage.getItem("sendedMails")) || [];
    const xlsxFileLS = localStorage.getItem("xlsxFile") || "";
    const pdfsPathLS = localStorage.getItem("pdfsPath") ?? "";
    const facturasPathLS = localStorage.getItem("facturasPath") ?? "";

    updateXlsxFile(xlsxFileLS);
    updateMailConfig(mailConfigLS);
    updateClientErrors(clientErrorsLS);
    updateSendedMails(sendedMailsLS);
    updatePathPdfs(pdfsPathLS);
    updatePathFacturas(facturasPathLS);
  }, []);

  const toggleModal = (title, type) => {
    updateContent(title);
    updateModalType(type)
    updateModal(true);
  };

  const showSending = () => {
    updateModal(true) 
    updateContent(<h1 className="p-4">Los mails se estan mandando</h1>)
   }

  async function updateXLSX() {
    const path = await getFile();
    localStorage.setItem("xlsxFile", path);
    updateXlsxFile(path);
    if (path) {
      const data = await loadTemplateDataFromXlsx(path);
      if (data) {
        localStorage.setItem("templateData", JSON.stringify(data[1]));
      }
    }
  }

  async function updatePdfs() {
    const path = await getDir();
    localStorage.setItem("pdfsPath", path);
    updatePathPdfs(path);
  }
  async function updateFacturas() {
    const path = await getDir();
    localStorage.setItem("facturasPath", path);
    updatePathFacturas(path);
  }

  async function submitMails(event) {
    event.preventDefault();

    const title = localStorage.getItem("titleToSend");
    const message = localStorage.getItem("msjeToSend");

    const mailInfo = {
      xlsxFile,
      pdfsPath,
      facturasPath,
      mailConfig,
      title,
      message,
    };
    showSending()
    toggleModal("Se estan enviando los mails", TYPES.SUCCESS);
    const data = await sendReports(mailInfo);
    if (typeof data == "string") {
      toggleModal(data, TYPES.WARNING);
      return;
    }
    const [errors, sendedMails] = data;
    updateClientErrors([]);
    updateSendedMails([]);
    updateClientErrors(errors);
    updateSendedMails(sendedMails);

    localStorage.setItem("clientErrors", JSON.stringify(errors));
    localStorage.setItem("sendedMails", JSON.stringify(sendedMails));
    toggleModal("Se enviaron con exito los mails", TYPES.SUCCESS);
    addAudit({
      title: "Envio de Reportes",
      body: `Envio con ${sendedMails.length} resultados positivos y ${errors.length} resultados negativos`,
      extra: errors,
    });
  }

  return (
    <main>
      <form
        className="mx-auto p-1 flex flex-col w-[500px] bg-content p-6 rounded-lg"
        id="form"
        onSubmit={submitMails}
      >
        <FormItem title="XLSX File" function={updateXLSX} value={xlsxFile}>
          {DatabaseIcon}
        </FormItem>
        <FormItem title="Carpeta PDFS" function={updatePdfs} value={pdfsPath}>
          {FolderIcon}
        </FormItem>
        <FormItem
          title="Carpeta Facturas"
          function={updateFacturas}
          value={facturasPath}
        >
          {FolderIcon}
        </FormItem>

        <div className="flex pt-4 justify-around">
          <a
            href="#/mensajes"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium rounded-lg border bg-extra text-white border-gray-600 hover:bg-extra2"
          >
            Editar Mensaje
          </a>
          <button
            type="submit"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-bold rounded-lg border bg-accent2 text-mainbg border-blue-600 text-white hover:bg-accent"
          >
            Enviar
          </button>
        </div>
      </form>
      <div className="mt-6"></div>
      <MailsTable array={clientErrors} />
      <div className="mt-6"></div>
      <MailsTable array={sendedMails} />
      {showModal && (
        <ModalSimple title={content} type={modalType} onExit={updateModal} />
      )}
    </main>
  );
}
