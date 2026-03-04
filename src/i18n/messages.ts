import navEn from "./locales/en/nav";
import homeEn from "./locales/en/home";
import commonEn from "./locales/en/common";
import aboutEn from "./locales/en/about";
import toolsEn from "./locales/en/tools";
import projectsEn from "./locales/en/projects";
import blogEn from "./locales/en/blog";

import navVi from "./locales/vi/nav";
import homeVi from "./locales/vi/home";
import commonVi from "./locales/vi/common";
import aboutVi from "./locales/vi/about";
import toolsVi from "./locales/vi/tools";
import projectsVi from "./locales/vi/projects";
import blogVi from "./locales/vi/blog";

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
    ...aboutEn,
    ...toolsEn,
    ...projectsEn,
    ...blogEn,
  },
  vi: {
    ...commonVi,
    ...navVi,
    ...homeVi,
    ...aboutVi,
    ...toolsVi,
    ...projectsVi,
    ...blogVi,
  },
} as const;

export type Lang = keyof typeof messages;
export type I18nKey = keyof (typeof messages)[typeof defaultLang];
