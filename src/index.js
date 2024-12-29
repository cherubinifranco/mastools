import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import NavBar from "./components/NavBar.jsx";
import SideMenu from "./components/SideMenu.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <main className="[&::-webkit-scrollbar]:hidden root">
      <NavBar />
      <SideMenu />
      <div className="flex flex-col ml-6 mt-6 items-center">
        <App />
      </div>
    </main>
  </React.StrictMode>
);
