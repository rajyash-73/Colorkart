import { createRoot } from "react-dom/client";
import "./index.vercel.css"; // Use the Vercel-specific CSS
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <App />
);