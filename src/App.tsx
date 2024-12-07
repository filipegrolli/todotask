import React from "react";
import { BrowserRouter } from "react-router-dom";
import RouterApp from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Definição do componente principal com tipagem explícita
const App: React.FC = (): JSX.Element => {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer autoClose={3000} />
        <RouterApp />
      </BrowserRouter>
    </div>
  );
};

export default App;
