export type SampleMeta = {
  id: string;
  title: string;
  party: string;
  type: string;
  blurb: string;
  traps: string[];
};

/**
 * Curated sample contracts, shipped as real PDFs in /public/contracts.
 * Analyses are precomputed with the same pipeline (scripts/preanalyze.mjs)
 * and committed to /src/data/samples so the demo works instantly with zero
 * LLM cost and no key configured.
 */
export const SAMPLES: SampleMeta[] = [
  {
    id: "vendor-msa",
    title: "Vendor Master Services Agreement",
    party: "Acme Manufacturing ↔ Provider Consulting",
    type: "MSA · consulting",
    blurb:
      "The classic vendor paper: auto-renewal with a 180-day notice trap, one-way indemnity, a 3-month liability cap — and a unilateral amendment clause.",
    traps: ["auto-renewal", "one-way indemnity", "low liability cap", "unilateral amendment"],
  },
  {
    id: "saas-subscription",
    title: "SaaS Subscription Agreement",
    party: "Northwind Retail ↔ CloudSuite Inc.",
    type: "SaaS · subscription",
    blurb:
      "Stacked auto-renewal price escalation, no SLA remedies, data lock-in on exit, and 'continued use constitutes acceptance' term changes.",
    traps: ["price escalation", "no SLA remedy", "data retrieval fee", "silent term change"],
  },
  {
    id: "employment-offer",
    title: "Senior Consultant Employment Agreement",
    party: "Halo Studio ↔ new hire",
    type: "Employment",
    blurb:
      "Broad non-compete, perpetual confidentiality, unpaid-notice clawback and IP assignment that overreaches into personal projects.",
    traps: ["non-compete", "perpetual NDA", "clawback", "broad IP assignment"],
  },
];

export function getSample(id: string): SampleMeta | undefined {
  return SAMPLES.find((s) => s.id === id);
}
