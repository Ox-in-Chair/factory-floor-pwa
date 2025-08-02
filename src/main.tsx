import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@/styles/global.css";
import "@/styles/tokens.css";

const container = document.getElementById("root") || document.createElement("div");
if (!container.id) container.id = "root";
document.body.appendChild(container);
createRoot(container).render(<App />);
