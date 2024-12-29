import { useEffect, useState } from "react";
import { getAudit } from "../utils";
import Modal from "../components/Modal";
import MailsTable from "../components/MailsTable";
export default function AuditoriaPage() {
  const [list, updateList] = useState([]);
  const [showModal, updateModal] = useState(false);
  const [content, updateContent] = useState(<></>);

  useEffect(() => {
    const listLS = JSON.parse(window.localStorage.getItem("auditArray")) ?? [];
    updateList(listLS);
  }, []);

  const toggleModal = (extra) => {
    updateModal((current) => !current);
    const newContent = <MailsTable array={extra} />;
    updateContent(newContent);
  };

  return (
    <main className="w-[700px]">
      <ol>
        {list.length > 0 ? (
          list.map((el, index) => (
            <li
              className="w-full bg-content rounded-lg p-4 my-4 text-white font-semibold tracking-wide"
              key={index}
            >
              <h1 className="pb-2">
                <span className="mr-3 ml-2 text-extra2">{el.timeStamp}</span>
                {el.title}
              </h1>
              <div className="flex justify-between">
                <p className="font-normal px-2 w-[530px]">{el.body}</p>
                {el.extra && (
                  <button
                    className="py-2.5 px-5 mt-6 text-sm font-bold rounded-lg bg-accent2 text-white hover:bg-accent w-[120px] text-center"
                    onClick={() => toggleModal(el.extra)}
                  >
                    Ver Detalles
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="w-full bg-content rounded-lg p-4 my-4 text-white font-semibold tracking-wide">
            <h1 className="pb-2">
              <span className="mr-3 ml-2 text-extra2">21/03/2024 - 12:15</span>
              Tarjeta de muestra
            </h1>
            <div className="flex justify-between">
              <p className="font-normal px-2 w-[530px]">Todavía no hay entradas en la auditoria, proba ingresando una de forma manual en el menu de inicio</p>
              <a href="#/" className="py-2.5 px-5 mt-6 text-sm font-bold rounded-lg bg-accent2 text-center text-white hover:bg-accent w-[120px]">Inicio</a>
            </div>
          </li>
        )}
      </ol>
      {showModal && <Modal onExit={updateModal}>{content}</Modal>}
    </main>
  );
}
