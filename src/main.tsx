import { createRoot } from "react-dom/client";
import { DialogProvider } from "./components/Dialog/DialogProvider.tsx";
import App from "./App.tsx";

// css
import "./css/reset.css";
import "./css/index.css";
import "./css/style.css";
import "./css/utilities.css";
import "./css/project.css";
import { Toast } from "./components/Toast.tsx";

createRoot(document.getElementById("root")!).render(
  <DialogProvider>
    <Toast>
      <App />
    </Toast>
  </DialogProvider>,
);
