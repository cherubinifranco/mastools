import { CloseIcon, MinimizeIcon, MaximizeIcon } from "./Icons";
export default function NavBar() {
  const handleMinimize = () => {
    window.controlAppBridge.minimizeApp();
  };
  const handleMaxRes = () => {
    window.controlAppBridge.maxResApp();
  };
  const handleClose = () => {
    window.controlAppBridge.closeApp();
  };

  return (
    <nav className="z-50 top-0 sticky bg-navbar gap-2 w-full m-auto flex justify-end items-center drag">
      <button
        title="Minimizar"
        className="hover:bg-slate-700 group h-8 w-8 flex items-center justify-center no-drag"
        onClick={handleMinimize}
      >
        {MinimizeIcon}
      </button>
      <button
        title="Maximizar"
        className="hover:bg-slate-700 group h-8 w-8 flex items-center justify-center no-drag"
        onClick={handleMaxRes}
      >
        {MaximizeIcon}
      </button>
      <button
        title="Cerrar"
        className="h-8 w-8 hover:bg-red-600 group flex items-center justify-center no-drag"
        onClick={handleClose}
      >
        {CloseIcon}
      </button>
    </nav>
  );
}
