import navEn from "./locales/en/nav";
import homeEn from "./locales/en/home";
import commonEn from "./locales/en/common";

import navVi from "./locales/vi/nav";
import homeVi from "./locales/vi/home";
import commonVi from "./locales/vi/common";

export const languages = {
  en: "English",
  vi: "Tiếng Việt",
} as const;

export const defaultLang = "en" as const;

export const messages = {
  en: {
    ...commonEn,
    ...navEn,
    ...homeEn,
  },
  vi: {
    ...commonVi,
    ...navVi,
    ...homeVi,
  },
} as const;

export type Lang = keyof typeof messages;
export type I18nKey = keyof (typeof messages)[typeof defaultLang];
