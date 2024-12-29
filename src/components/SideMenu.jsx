import SideMenuItem from "./SideMenuItem.jsx";
import { HomeIcon, MessageIcon, ReportIcon, DatabaseIcon, ConfigIcon } from "./Icons.jsx";

export default function SideMenu() {
  return (
    <div
      id="drawer-navigation"
      className="fixed top-6 left-0 z-40 w-64 h-screen p-4 overflow-y-hidden -translate-x-[220px] focus-within:translate-x-0 group-active:translate-x-0 transition-transform hover:translate-x-0 bg-sidemenu hover:overflow-y-auto border-r-0"
      tabIndex="-1"
      aria-labelledby="drawer-navigation-label"
    >
      <div className="py-4 overflow-y-auto">
        <ul className="space-y-2 font-medium mx-1">
          <SideMenuItem href="#/">
            {HomeIcon}
            <h2>Inicio</h2>
          </SideMenuItem>

          <SideMenuItem href="#/comunicados">
            {MessageIcon}
            <h2>Comunicados</h2>
          </SideMenuItem>

          <SideMenuItem href="#/reportes">
            {ReportIcon}
            <h2>Reportes</h2>
          </SideMenuItem>

          <SideMenuItem href="#/auditoria">
            {DatabaseIcon}
            <h2>Auditoria</h2>
          </SideMenuItem>

          <SideMenuItem href="#/configuracion">
            {ConfigIcon}
            <h2>Configuracion</h2>
          </SideMenuItem>
        </ul>
      </div>
    </div>
  );
}
