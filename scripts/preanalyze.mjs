// Precompute analyses for the sample contracts with the REAL pipeline
// (extract → LLM → locate) and commit the results, so the live demo works
// instantly and keylessly. Re-run when prompts or samples change.
import { config } from "dotenv";
config({ path: ".env.local" });
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { extractPdf } from "../src/lib/pdf.ts";
import { runLlmAnalysis } from "../src/lib/analyze.ts";
import { SAMPLES } from "../src/lib/samples.ts";

const results = {};
for (const s of SAMPLES) {
  const pdfPath = `public/contracts/${s.id}.pdf`;
  if (!existsSync(pdfPath)) {
    console.error(`missing ${pdfPath} — run gen-contracts.mjs first`);
    process.exit(1);
  }
  const bytes = new Uint8Array(readFileSync(pdfPath));
  const extracted = await extractPdf(bytes);
  console.log(`${s.id}: ${extracted.numPages} pages, ${extracted.text.length} chars`);

  const analysis = await runLlmAnalysis(extracted.text);
  if (!analysis) {
    console.error(`${s.id}: LLM analysis failed — is LLM_* configured in .env.local?`);
    process.exit(1);
  }
  const located = analysis.clauses.filter((c) => c.quote);
  results[s.id] = analysis;
  console.log(`  → ${analysis.clauses.length} clauses (${analysis.clauses.filter((c) => c.risk === "high").length} high) — saved`);
  void located;
}

writeFileSync("src/data/samples/analyses.json", JSON.stringify(results, null, 2));
console.log("wrote src/data/samples/analyses.json");
