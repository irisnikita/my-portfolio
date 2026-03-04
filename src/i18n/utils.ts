import { defaultLang, messages, type Lang, type I18nKey } from "./messages";

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang && lang in messages) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: I18nKey) {
    return messages[lang][key] ?? messages[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Lang) {
  return function translatePath(path: string, l: Lang = lang) {
    if (!l || l === defaultLang) return path;
    // Keep hash routing intact: '/#contact' -> '/vi/#contact'
    if (path.startsWith("/#")) return `/${l}/#${path.slice(2)}`;
    return `/${l}${path}`;
  };
}
