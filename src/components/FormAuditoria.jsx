import { useState } from "react";
import { addAudit, getAudit } from "../utils";

export default function FormAuditoria() {
  const [newTitle, updateTitle] = useState("");
  const [newBody, updateBody] = useState("");
  const submitForm = async (event) => {
    event.preventDefault();
    const audit = { title: newTitle, body: newBody };
    addAudit(audit);
    updateBody("");
    updateTitle("");
  };

  const titleChange = (event) => {
    const value = event.target.value;
    updateTitle(value);
  };
  const bodyChange = (event) => {
    const value = event.target.value;
    updateBody(value);
  };

  return (
    <form className="text-black bg-content rounded-lg" onSubmit={submitForm}>
      <h1 className="text-white font-semibold bg-extracontent p-3 rounded-t-lg">
        Agregar auditoria
      </h1>
      <input
        className="w-1/2 m-3 p-2 indent-1 bg-extracontent rounded-lg placeholder-extra2 text-white"
        type="text"
        placeholder="Titulo"
        value={newTitle}
        onChange={titleChange}
      />
      <textarea
        placeholder="Contenido"
        rows={6}
        className="h-full block w-[675px] mx-auto py-2 px-4 text-sm text-white border-0 bg-extracontent focus:ring-0 placeholder-extra2 outline-none customScrollBar rounded-lg"
        type="text"
        value={newBody}
        onChange={bodyChange}
      />
      <button
        type="submit"
        className="py-2.5 px-5 m-3 text-sm font-bold rounded-lg bg-accent2 text-mainbg text-white hover:bg-accent w-32"
      >
        Agregar
      </button>
    </form>
  );
}
