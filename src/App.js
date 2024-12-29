import "./App.css";
import "./App.css";
import IndexPage from "./pages/Index.jsx";
import ComunicadosPage from "./pages/Comunicados.jsx"
import ReportesPage from "./pages/Reportes.jsx";
import AuditoriaPage from "./pages/Auditoria.jsx";
import ConfiguracionPage from "./pages/Configuracion.jsx";
import MessagesPage from "./pages/Mensajes.jsx";

import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
      <HashRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/comunicados" element={<ComunicadosPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/auditoria" element={<AuditoriaPage />} />
          <Route path="/configuracion" element={<ConfiguracionPage />} />
          <Route path="/mensajes" element={<MessagesPage />} />
        </Routes>
      </HashRouter>
  );
}

export default App;
