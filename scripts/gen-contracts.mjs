// Generate the three sample contract PDFs shipped in /public/contracts.
// Deliberately plants realistic one-sided clauses so the analyzer has something to find.
import { PDFDocument, StandardFonts } from "pdf-lib";
import { writeFileSync, mkdirSync } from "node:fs";

const PAGE_W = 612, PAGE_H = 792, MARGIN = 72, LINE = 14, MAX_W = PAGE_W - MARGIN * 2;

function makeDoc(title, intro, clauses) {
  return { title, intro, clauses };
}

function wrap(text, font, size) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (font.widthOfTextAtSize(t, size) > MAX_W) { lines.push(line); line = w; }
    else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

async function render({ title, intro, clauses }, outFile) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page = null, y = 0;

  const newPage = () => { page = doc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN; };
  const ensure = (h) => { if (y - h < MARGIN + 40) newPage(); };

  newPage();
  page.drawText(title.toUpperCase(), { x: MARGIN, y, size: 15, font: bold });
  y -= 24;
  for (const l of wrap(intro, font, 10)) { ensure(LINE); page.drawText(l, { x: MARGIN, y, size: 10, font }); y -= LINE; }
  y -= 14;

  let n = 0;
  for (const [head, body] of clauses) {
    n++;
    for (const l of wrap(`${n}. ${head}`, bold, 12)) { ensure(LINE); page.drawText(l, { x: MARGIN, y, size: 12, font: bold }); y -= LINE; }
    y -= 4;
    for (const l of wrap(body, font, 10)) { ensure(LINE); page.drawText(l, { x: MARGIN, y, size: 10, font }); y -= LINE; }
    y -= 12;
  }

  const bytes = await doc.save();
  writeFileSync(outFile, bytes);
  console.log(`${outFile}: ${bytes.length} bytes, ${doc.getPageCount()} pages, ${n} clauses`);
}

const msa = makeDoc(
  "Master Services Agreement",
  'This Master Services Agreement ("Agreement") is entered into between Acme Manufacturing Pte. Ltd. ("Client") and Provider Consulting Ltd. ("Provider"), effective as of 1 October 2026. Provider shall supply supply-chain consulting services as described in one or more Statements of Work.',
  [
    ["TERM AND AUTO-RENEWAL", "This Agreement commences on the Effective Date and continues for an initial term of twenty-four (24) months. Thereafter, this Agreement shall automatically renew for successive twenty-four (24) month periods unless either party provides written notice of non-renewal at least one hundred eighty (180) days prior to the end of the then-current term."],
    ["FEES, ESCALATION AND PAYMENT", "Client shall pay Provider a monthly fee of USD 45,000. Provider may increase the monthly fee by up to eight percent (8%) upon each renewal term without Client consent. All invoices are payable within ninety (90) days of receipt. Late payments accrue interest at two percent (2%) per month."],
    ["INDEMNIFICATION", "Client shall indemnify, defend, and hold harmless Provider, its affiliates, and their respective officers, directors, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to Client's use of the services, regardless of fault."],
    ["LIMITATION OF LIABILITY", "In no event shall Provider be liable to Client for any indirect, incidental, special, consequential, or punitive damages. Provider's total aggregate liability under this Agreement shall not exceed the fees paid by Client in the three (3) months preceding the claim. Client acknowledges that Provider shall not be liable for any breach of confidentiality obligations under this Agreement."],
    ["TERMINATION", "Client may terminate for convenience upon one hundred twenty (120) days prior written notice and shall pay an early termination fee equal to fifty percent (50%) of all fees remaining in the then-current term. Provider may terminate for convenience at any time upon seven (7) days notice without penalty or early termination fee."],
    ["UNILATERAL AMENDMENT", "Provider may modify this Agreement, including any fees or service descriptions, at any time upon thirty (30) days notice. Client's continued use of the services after such notice constitutes acceptance of the modified terms."],
    ["CONFIDENTIALITY", "Each party shall protect the other party's confidential information with reasonable care. The obligations of this section survive termination for a period of one (1) year."],
    ["GOVERNING LAW", "This Agreement is governed by the laws of England and Wales. The parties submit to the exclusive jurisdiction of the courts of London, and each party waives any objection to that venue."],
  ],
);

const saas = makeDoc(
  "SaaS Subscription Agreement",
  'This SaaS Subscription Agreement ("Agreement") governs use of the CloudSuite commerce platform ("Service") provided by CloudSuite Inc. ("Supplier") to Northwind Retail Ltd. ("Customer"). By clicking accept or using the Service, Customer agrees to this Agreement.',
  [
    ["SUBSCRIPTION TERM AND RENEWAL", "The initial subscription term is twelve (12) months. The subscription automatically renews for successive twelve (12) month terms unless Customer gives written notice of non-renewal no later than ninety (90) days before the end of the then-current term. Notices must be given by registered mail."],
    ["PRICE ESCALATION", "Supplier may adjust subscription fees at each renewal by up to fifteen percent (15%) above the prevailing Consumer Price Index, or by such higher amount as Supplier determines in its discretion, effective upon renewal without Customer consent."],
    ["SERVICE LEVELS", "Supplier targets 99.0% monthly availability of the Service. Availability below this target does not entitle Customer to any refund, service credit, damages, or termination right, whether at law, in equity or under this Agreement."],
    ["CUSTOMER DATA AND EXIT", "Upon termination, Customer may export Customer Data for a period of thirty (30) days. Thereafter Supplier may delete all Customer Data permanently, and a data retrieval fee of USD 5,000 applies to any export requested after the termination date."],
    ["SUSPENSION", "Supplier may suspend the Service immediately and without notice if Supplier reasonably believes Customer's use violates this Agreement, without liability for any resulting damages or losses."],
    ["CHANGES TO TERMS", "Supplier may modify this Agreement at any time by posting an updated version on its website. Customer's continued use of the Service constitutes acceptance of the updated terms."],
    ["LIMITATION OF LIABILITY", "Supplier's total aggregate liability shall not exceed the fees paid in the single month preceding the claim. Supplier shall not be liable for lost profits, lost revenue, or any indirect or consequential damages."],
    ["GOVERNING LAW", "This Agreement is governed by the laws of the State of Delaware, without regard to conflict of laws principles."],
  ],
);

const employment = makeDoc(
  "Employment Agreement — Senior Consultant",
  'This Employment Agreement ("Agreement") is made between Halo Studio Pte. Ltd. ("the Company") and the undersigned employee ("the Employee"), effective on the Start Date set out in the offer letter.',
  [
    ["PROBATION AND NOTICE", "Employment is subject to a six (6) month probationary period, during which either party may terminate with one (1) day notice. After confirmation, the Company may terminate with seven (7) days notice; the Employee must give ninety (90) days written notice of resignation."],
    ["NON-COMPETE", "For a period of twenty-four (24) months after termination of employment, for any reason, the Employee shall not directly or indirectly engage in, advise, or be employed by any business operating in the digital services industry in any country in Southeast Asia."],
    ["INTELLECTUAL PROPERTY", "The Employee assigns to the Company all rights, title and interest in all works, inventions, code and designs created during the term of employment, whether or not created during working hours, using Company equipment, or relating to Company business, including works created on personal devices and personal time."],
    ["CONFIDENTIALITY", "The Employee shall keep all Company information confidential in perpetuity, including after termination, regardless of whether such information is public knowledge through no fault of the Employee."],
    ["TRAINING CLAWBACK", "If the Employee resigns within twenty-four (24) months of completing any Company-provided training, the Employee shall repay the full documented cost of such training, including travel costs, within fourteen (14) days of the resignation date."],
    ["VARIATION OF DUTIES", "The Company may vary the Employee's duties, reporting line, remuneration structure and place of work at any time at its sole discretion. Continued employment constitutes acceptance of any variation."],
    ["GOVERNING LAW", "This Agreement is governed by the laws of Singapore and the Employee submits to the exclusive jurisdiction of the Singapore courts."],
  ],
);

mkdirSync("public/contracts", { recursive: true });
await render(msa, "public/contracts/vendor-msa.pdf");
await render(saas, "public/contracts/saas-subscription.pdf");
await render(employment, "public/contracts/employment-offer.pdf");
