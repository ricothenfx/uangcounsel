/**
 * Server-side PDF text extraction via pdfjs legacy build (Node-safe).
 * Returns per-page text items + page dimensions for the token index.
 */
import type { PdfPageInfo, PdfTextItem } from "./locate";

export type ExtractedPdf = {
  itemsPerPage: PdfTextItem[][];
  pageDims: PdfPageInfo[];
  text: string;
  numPages: number;
};

export async function extractPdf(bytes: Uint8Array): Promise<ExtractedPdf> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const loadingTask = pdfjs.getDocument({
    data: bytes,
    useSystemFonts: true,
  });
  const doc = await loadingTask.promise;

  const itemsPerPage: PdfTextItem[][] = [];
  const pageDims: PdfPageInfo[] = [];
  let text = "";

  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items: PdfTextItem[] = [];
    for (const item of content.items) {
      if (!("str" in item) || !item.str) continue;
      items.push({
        str: item.str,
        width: item.width,
        transform: item.transform as number[],
      });
    }
    itemsPerPage.push(items);
    pageDims.push({ page: p, width: viewport.width, height: viewport.height });
    text += items.map((i) => i.str).join(" ").replace(/\s+/g, " ") + "\n";
    page.cleanup();
  }
  await loadingTask.destroy();

  return { itemsPerPage, pageDims, text: text.trim(), numPages: itemsPerPage.length };
}

/** Plain text only (for the LLM prompt). */
export function pdfToText(itemsPerPage: PdfTextItem[][]): string {
  let out = "";
  for (const items of itemsPerPage) {
    out += items.map((i) => i.str).join(" ").replace(/\s+/g, " ") + "\n";
  }
  return out.trim();
}
