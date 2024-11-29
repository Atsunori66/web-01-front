// import "server-only";
import type { Locale } from "./i18n-config";

const dictionaries = {
  en: () => import("../dictionaries/en.json").then((module) => module.default),
  es: () => import("../dictionaries/es.json").then((module) => module.default),
  fr: () => import("../dictionaries/fr.json").then((module) => module.default),
  de: () => import("../dictionaries/de.json").then((module) => module.default),
  ja: () => import("../dictionaries/ja.json").then((module) => module.default),
  ch: () => import("../dictionaries/ch.json").then((module) => module.default),
  kr: () => import("../dictionaries/kr.json").then((module) => module.default)
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]?.() ?? dictionaries.en();
