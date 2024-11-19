import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { Web3Provider } from "./blockchain/WagmiProvider";

createRoot(document.getElementById("root")).render(
  <Web3Provider>
    <StrictMode>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: "5px",
            background: "#333",
            color: "#fff",
            fontFamily: "Arial, Helvetica, sans-serif",
          },
        }}
      />
    </StrictMode>
  </Web3Provider>
);
