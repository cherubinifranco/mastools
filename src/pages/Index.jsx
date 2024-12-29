import { useEffect, useState } from "react";
import FormAuditoria from "../components/FormAuditoria.jsx";

export default function IndexPage() {
  const [totalSended, updateTotalSended] = useState(0)

  useEffect(()=> {
    const totalSendedLS = JSON.parse(localStorage.getItem("totalSended")) ?? 0
    updateTotalSended(totalSendedLS)
  }, [])

  return (
    <main className="text-white w-[700px]">
      <div className="flex flex-row justify-around gap-3 p-4 my-8">
        <button className="bg-content p-6 rounded-lg font-semibold hover:bg-extracontent">
          Ultimos Movimientos
        </button>
        <div className="bg-content p-6 rounded-lg font-semibold">
          Total de
          <span className="p-4 text-accent bg-extracontent rounded-lg m-4">
            {totalSended}
          </span>
          Mails Enviados
        </div>
      </div>

      <div>
        <FormAuditoria />
      </div>
    </main>
  );
}
