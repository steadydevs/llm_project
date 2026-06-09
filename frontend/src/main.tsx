import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { StrictMode } from "react";
import { I18nProvider } from "./i18n/I18nProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <I18nProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </I18nProvider>,
);
