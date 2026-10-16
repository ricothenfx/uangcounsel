import { describe, expect, it } from "vitest";
import { negotiateLocale } from "@/lib/i18n/config";

describe("negotiateLocale", () => {
  it("returns the default for missing or empty headers", () => {
    expect(negotiateLocale(null)).toBe("en");
    expect(negotiateLocale(undefined)).toBe("en");
    expect(negotiateLocale("")).toBe("en");
  });

  it("matches exact locales", () => {
    expect(negotiateLocale("en")).toBe("en");
    expect(negotiateLocale("id")).toBe("id");
    expect(negotiateLocale("zh")).toBe("zh");
    expect(negotiateLocale("es")).toBe("es");
  });

  it("falls back to the base subtag", () => {
    expect(negotiateLocale("en-US,en;q=0.9")).toBe("en");
    expect(negotiateLocale("id-ID,id;q=0.9,en;q=0.8")).toBe("id");
    expect(negotiateLocale("zh-TW,zh;q=0.9,en;q=0.8")).toBe("zh");
    expect(negotiateLocale("es-MX,es;q=0.9")).toBe("es");
  });

  it("respects quality ordering", () => {
    expect(negotiateLocale("es;q=0.9,en;q=0.8")).toBe("es");
    expect(negotiateLocale("en;q=0.5,es;q=0.9")).toBe("es");
  });

  it("falls back to the default for unknown languages", () => {
    expect(negotiateLocale("fr-FR,fr;q=0.9")).toBe("en");
    expect(negotiateLocale("de-DE")).toBe("en");
  });
});
