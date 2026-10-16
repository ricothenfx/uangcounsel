import { cache } from "react";
import { cookies, headers } from "next/headers";
import {
  isLocale,
  LOCALES_META,
  LOCALE_COOKIE,
  negotiateLocale,
  type Locale,
} from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { id } from "./dictionaries/id";
import { zh } from "./dictionaries/zh";
import { es } from "./dictionaries/es";

const dictionaries: Record<Locale, Dictionary> = { en, id, zh, es };

export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value ?? "";
  if (isLocale(value)) return value;
  const head = await headers();
  return negotiateLocale(head.get("accept-language"));
});

export const getDictionary = cache(async (): Promise<Dictionary> =>
  dictionaries[await getLocale()],
);

export const getDateLocale = cache(async (): Promise<string> =>
  LOCALES_META[await getLocale()].bcp47,
);
