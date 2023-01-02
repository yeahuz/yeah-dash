import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(LanguageDetector)
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: "ru",
    preload: ["ru"],
    saveMissing: true,
    supportedLngs: ["ru", "uz", "en"],
    ns: ["common", "auth", "posting"],
    backend: {
      loadPath: "/public/locales/{{lng}}/{{ns}}.json",
      addPath: "/public/locales/{{lng}}/{{ns}}.missing.json"
    }
  });

export default i18n;
