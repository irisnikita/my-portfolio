import { defaultLang, type Lang, languages } from "./messages";

/**
 * Static paths for locale route segment: `[...lang]`.
 *
 * We use a **rest param** so that we can set it to `undefined` for the default locale,
 * which generates the non-prefixed routes (e.g. `/about`).
 *
 * - Default locale has no prefix: `/about`
 * - Non-default locales are prefixed: `/vi/about`
 */
export function getStaticPaths() {
  return Object.keys(languages).map((l) => {
    const lang = l as Lang;
    return lang === defaultLang ? { params: { lang: undefined } } : { params: { lang } };
  });
}
