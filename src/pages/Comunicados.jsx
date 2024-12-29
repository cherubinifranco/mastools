import { useState, useEffect, Children } from "react";
import {
  getFile,
  sendMails,
  loadTemplateDataFromXlsx,
  addAudit,
  nofify
} from "../utils";
import FormItem from "../components/FormItem";
import MailsTable from "../components/MailsTable";
import ModalSimple from "../components/ModalSimple";
import Modal from "../components/Modal";
import { FileIcon, DatabaseIcon, CloudIcon } from "../components/Icons";

const TYPES = {
  SUCCESS: "success",
  WARNING: "warning",
  LOADING: "loading"
}

export default function ComunicadosPage() {
  const [mailConfig, updateMailConfig] = useState({});
  const [clientErrors, updateClientErrors] = useState(() => []);
  const [sendedMails, updateSendedMails] = useState(() => []);
  const [xlsxFile, updateXlsxFile] = useState(() => "");
  const [files, updateFiles] = useState(() => []);
  const [showModal, updateModal] = useState(false);
  const [content, updateContent] = useState(<></>);
  const [modalType, updateModalType] = useState("warning");

  useEffect(() => {
    const mailConfigLS = JSON.parse(localStorage.getItem("mailConfig")) || {};
    const clientErrorsLS =
      JSON.parse(localStorage.getItem("clientErrorsComunicado")) || [];
    const sendedMailsLS =
      JSON.parse(localStorage.getItem("sendedMailsComunicado")) || [];
    const xlsxFileLS = localStorage.getItem("xlsxFile") || "";
    const filesLS = JSON.parse(localStorage.getItem("files")) || [];
    updateFiles(filesLS);
    updateXlsxFile(xlsxFileLS);
    updateMailConfig(mailConfigLS);
    updateClientErrors(clientErrorsLS);
    updateSendedMails(sendedMailsLS);
  }, []);




  const toggleModal = (title, type) => {
    updateContent(title);
    updateModalType(type)
    updateModal(true);
  };

  async function addFile() {
    const path = await getFile();
    if (!path) return;
    const filename = path.split("\\").reverse()[0];
    const obj = { filename, path };
    const newFiles = [...files, obj];
    localStorage.setItem("files", JSON.stringify(newFiles));
    updateFiles(newFiles);
  }

  async function deteleFile(event, index) {
    const newFiles = [...files.slice(0, index), ...files.slice(index + 1)];
    localStorage.setItem("files", JSON.stringify(newFiles));
    updateFiles(newFiles);
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

  async function submitMails(event) {
    event.preventDefault();

    const title = localStorage.getItem("titleToSend");
    const message = localStorage.getItem("msjeToSend");

    const mailInfo = {
      xlsxFile,
      mailConfig,
      title,
      message,
      files,
    };
    
    toggleModal("Se estan enviando los mails", TYPES.LOADING);

    const data = await sendMails(mailInfo);

    if (typeof data == "string") {
      toggleModal(data, TYPES.WARNING);
      return;
    }
    const [errors, sendedMails] = data;
    updateClientErrors(errors);
    updateSendedMails(sendedMails);

    localStorage.setItem("clientErrorsComunicado", JSON.stringify(errors));
    localStorage.setItem("sendedMailsComunicado", JSON.stringify(sendedMails));
    nofify({title: "Envio con exito", body:`Se enviaron con exito ${sendedMails.length} de ${sendedMails.length + errors.length} mails`})
    toggleModal("Se enviaron con exito los mails", TYPES.SUCCESS);
    addAudit({
      title: "Envio de Comunicados",
      body: `Envio con ${sendedMails.length} resultados positivos y ${errors.length} resultados negativos`,
      extra: errors,
    });
    
  }

  return (
    <main>
      <form
        className="flex flex-col w-[500px] bg-content p-6 rounded-lg mx-auto"
        id="form"
        onSubmit={submitMails}
      >
        <FormItem title="XLSX File" function={updateXLSX} value={xlsxFile}>
          {DatabaseIcon}
        </FormItem>
        <div className="flex items-center justify-center w-full pt-3">
          <button
            type="button"
            onClick={() => addFile()}
            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer dark:hover:bg-extra bg-extracontent border-border hover:border-gray-500 hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {CloudIcon}
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">
                  Click para cargar archivos
                </span>
              </p>
            </div>
          </button>
        </div>

        <div className="w-full pt-4 flex gap-3 flex-wrap pl-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="group relative w-20 px-2 h-16 border border-gray-500 rounded-lg group text-gray-300"
            >
              <button
                onClick={() => deteleFile(event, index)}
                type="button"
                className="absolute translate-y-4 -top-3 -right-1 opacity-0 bg-red-500 w-5 h-5 rounded-lg text-xs transition-all duration-200 group-hover:translate-y-2 group-hover:opacity-100 focus-within:translate-y-2 focus-within:opacity-100"
              >
                X
              </button>
              {FileIcon}
              <h1 className="truncate text-center hover:text-clip hover:overflow-visible">
                {file.filename}
              </h1>
            </div>
          ))}
        </div>

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
        <ModalSimple title={content} onExit={updateModal} type={modalType} />
      )}
    </main>
  );
}
