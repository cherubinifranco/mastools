import { useState, useEffect, Children } from "react";
import { loadTemplateDataFromXlsx, applyTemplate } from "../utils";
import Modal from "../components/Modal";
import { ResetIcon, QuestionIcon2, DatabaseIcon2, TrashIcon } from "../components/Icons";


export default function MessagesPage() {
  const [modalHelp, setModalHelp] = useState(false);
  const [modalVariables, setModalVariables] = useState(false);
  const [presetSelected, updatePresetSelected] = useState(0);
  const [xlsxFile, updatexlsxFile] = useState("");
  const [msjeText, updateText] = useState("");
  const [titleText, updateTitle] = useState("");
  const [templateData, updateTemplateData] = useState({});

  useEffect(() => {
    const xlsxFileLS = localStorage.getItem("xlsxFile") ?? "";
    const titleTextLS = localStorage.getItem(`titleToSend`) ?? "";

    const msjeTextLS = localStorage.getItem(`msjeToSend`) ?? "";
    const templateDataLS =
      JSON.parse(localStorage.getItem("templateData")) ?? {};

    const presetSelectedLS = localStorage.getItem("presetSelected") ?? 1;

    updatePresetSelected(presetSelectedLS);
    updateTemplateData(templateDataLS);
    updatexlsxFile(xlsxFileLS);
    updateTitle(titleTextLS);
    updateText(msjeTextLS);
  }, []);

  let previewMessage = applyTemplate(msjeText, templateData);
  const handleChange = (event) => {
    const value = event.target.value;
    updateText(value);
    localStorage.setItem(`msjeP${presetSelected}`, value);
  };

  const handleTitleChange = (event) => {
    const value = event.target.value;
    updateTitle(value);
    localStorage.setItem(`titleP${presetSelected}`, value);
  };

  const loadPreset = (value) => {
    const titleTextLS = localStorage.getItem(`titleP${value}`) ?? "";
    const msjeTextLS = localStorage.getItem(`msjeP${value}`) ?? "";
    updateTitle(titleTextLS);
    updateText(msjeTextLS);
    updatePresetSelected(value);
    localStorage.setItem("presetSelected", value);
  };
  const clearData = () => {
    updateTitle("");
    updateText("");
  };
  const restoreData = () => {
    const titleTextLS = localStorage.getItem(`titleP${presetSelected}`) ?? "";
    const msjeTextLS = localStorage.getItem(`msjeP${presetSelected}`) ?? "";
    updateTitle(titleTextLS);
    updateText(msjeTextLS);
  };

  const toggleVariables = () => {
    setModalVariables(!modalVariables);
  };

  const toggleHelp = () => {
    setModalHelp(!modalHelp);
  };

  const handleBack = (event) => {
    event.preventDefault();
    localStorage.setItem("msjeToSend", msjeText);
    localStorage.setItem("titleToSend", titleText);
    history.back();
  };

  return (
    <form className="flex flex-row flex-wrap justify-center gap-6 w-full min-h-screen p-12 -mt-12">
      <section className="w-full mix-w-[500px] max-w-[700px] min-h-96">
        <div className="flex items-center justify-between px-2 py-2 bg-extracontent rounded-t-lg">
          <input
            value={titleText}
            type="text"
            onChange={handleTitleChange}
            placeholder="Asunto"
            className="w-full px-2 border-0 focus:outline-0 bg-extracontent text-white placeholder-extra"
            tabIndex={1}
          />
          <div className="flex">
            <fieldset className="flex items-center space-x-1 px-2 border-x border-border">
              <button
                type="button"
                className="p-2 text-extra2 rounded cursor-pointer hover:bg-border hover:text-white"
                tabIndex={1}
                onClick={restoreData}
              >
                {ResetIcon}
              </button>
              <button
                type="button"
                className="p-2 text-extra2 rounded cursor-pointer hover:bg-border hover:text-white"
                tabIndex={1}
                onClick={clearData}
              >
                {TrashIcon}
              </button>
              <button
                type="button"
                className="p-2 text-extra2 font-bold text-base rounded cursor-pointer hover:bg-border hover:text-white"
                tabIndex={1}
                onClick={toggleVariables}
              >
                {DatabaseIcon2}
              </button>
              <button
                type="button"
                className="p-2 text-extra2 font-bold text-base rounded cursor-pointer hover:bg-border hover:text-white"
                tabIndex={1}
                data-modal-target="default-modal"
                data-modal-toggle="default-modal"
                onClick={toggleHelp}
              >
                {QuestionIcon2}
              </button>
            </fieldset>

            <fieldset className="flex items-center space-x-1 rtl:space-x-reverse ps-4">
              <button
                type="button"
                className={
                  "p-2 w-6 text-extra2 rounded cursor-pointer hover:bg-border hover:text-white text-xs font-semibold " +
                  (presetSelected == 1 ? " bg-extra text-white" : "")
                }
                title="Preset 1"
                onClick={() => loadPreset(1)}
                tabIndex={2}
              >
                1
              </button>
              <button
                type="button"
                className={
                  "p-2 w-6 text-extra2 rounded cursor-pointer hover:bg-border hover:text-white text-xs font-semibold " +
                  (presetSelected == 2 ? " bg-extra text-white" : "")
                }
                title="Preset 2"
                onClick={() => loadPreset(2)}
                tabIndex={2}
              >
                2
              </button>
              <button
                type="button"
                className={
                  "p-2 w-6 text-extra2 rounded cursor-pointer hover:bg-border hover:text-white text-xs font-semibold " +
                  (presetSelected == 3 ? " bg-extra text-white" : "")
                }
                title="Preset 3"
                onClick={() => loadPreset(3)}
                tabIndex={2}
              >
                3
              </button>
              <button
                type="button"
                className={
                  "p-2 w-6 text-extra2 rounded cursor-pointer hover:bg-border hover:text-white text-xs font-semibold " +
                  (presetSelected == 4 ? " bg-extra text-white" : "")
                }
                title="Preset 4"
                onClick={() => loadPreset(4)}
                tabIndex={2}
              >
                4
              </button>
            </fieldset>
          </div>
        </div>
        <textarea
          tabIndex={2}
          value={msjeText}
          onChange={handleChange}
          className="min-h-96 block w-full py-2 px-4 rounded-b-lg text-sm text-white border-0 bg-content focus:ring-0 placeholder-extra outline-none customScrollBar"
          placeholder="Mensaje..."
        ></textarea>
        <button
          type="submit"
          className="py-2.5 px-5 mt-6 text-sm font-bold rounded-lg  bg-accent2 text-mainbg  text-white hover:bg-accent"
          onClick={handleBack}
          tabIndex={2}
        >
          Guardar
        </button>
      </section>

      <section className="w-full min-w-[500px] max-w-[700px] min-h-96">
        <textarea
          readOnly
          value={previewMessage}
          className="h-full block w-full py-2 px-4 rounded-lg text-sm text-white border-0 bg-content focus:ring-0 placeholder-extra outline-none customScrollBar"
          placeholder="Vista previa..."
        ></textarea>

        {modalHelp && (
          <Modal
            title=""
            note="No olvides cargar el archivo XLSX"
            onExit={setModalHelp}
          >
            <div className="p-4 bg-content">
              <ul className="list-disc p-3">
                <li className="m-2 text-pretty">
                  <h1 className="font-medium">Cargar las variables</h1>
                  <p>
                    Al seleccionarse un archivo XLSX se carga la primera fila como titulos
                    para utilizar en el momento de enviar mensajes
                  </p>
                  <img className="p-2" src="./assets/xlsxHelp.png" alt="Help" />
                  <p>
                    En este caso se carga: "ID", "Nombre", "Apellido",
                    "Mail" y "sin valor"
                  </p>
                  <p>
                    Tambien se carga la segunda fila como valores de muestra.
                  </p>
                </li>
                <li className="m-2 py-2 text-pretty">
                  <h1 className="font-medium">Utilizar las variables</h1>
                  <p>
                    Al momento de escribir el mail, si se quiere usar el
                    contenido de una columna se debe ingresar el nombre de la
                    misma entre {"{}"}.
                  </p>
                  <p>
                    En este caso se podría utilizar {"{ID}"} y cuando se
                    envie el primer mail se cambiaría por "111", el segundo
                    mail por "222" y así continuamente.
                  </p>
                </li>
              </ul>
              <div className="flex justify-center">
                <button
                  type="button"
                  className=" py-2.5 px-5 me-2 mb-2 text-sm font-bold rounded-lg border bg-accent2 text-mainbg border-blue-600 text-white hover:bg-accent"
                  onClick={() => {toggleHelp(); toggleVariables()}}
                >
                  Ver mis variables cargadas
                </button>
              </div>
            </div>
          </Modal>
        )}

        {modalVariables && (
          <Modal
            title={
              <table className="w-full text-sm text-left rtl:text-right">
                <thead className="text-xs text-white uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3 w-[300px]">
                      Variable
                    </th>
                    <th scope="col" className="py-3">
                      Valor de ejemplo
                    </th>
                  </tr>
                </thead>
              </table>
            }
            onExit={setModalVariables}
            note="Las variables se usan entre {}"
          >
            <table className="w-full text-sm text-left rtl:text-right">
              <tbody>
                {Object.entries(templateData).map((el) => (
                  <tr
                    className="border-b bg-content border-extracontent"
                    key={el[0] + "entry"}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-white whitespace-nowrap"
                    >
                      {el[0]}
                    </th>
                    <td className="px-6 py-4 text-extra2">{el[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>
        )}
      </section>
    </form>
  );
}
