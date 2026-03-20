import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import landingKo from '@/locales/ko/landing.json';
import landingEn from '@/locales/en/landing.json';
import scanKo from '@/locales/ko/scan.json';
import scanEn from '@/locales/en/scan.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: {
        landing: landingKo,
        scan: scanKo,
      },
      en: {
        landing: landingEn,
        scan: scanEn,
      },
    },
    lng: "ko",
    fallbackLng: "en",
    ns: ["landing"],
    defaultNS: "landing",
    interpolation: { escapeValue: false },
  });

export default i18n;
