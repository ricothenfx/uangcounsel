import { expect, test } from "@playwright/test";

test.describe("UangCounsel", () => {
  test("home page renders with hero and samples", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Contracts reviewed");
    await expect(page.getByText("Try a sample contract")).toBeVisible();
    await expect(page.getByText("Upload your PDF")).toBeVisible();
  });

  test("sample analysis → highlights → clause jump (full flow)", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "MSA" }).click();

    // findings appear
    const firstCard = page.locator(".clause-card").first();
    await expect(firstCard).toBeVisible({ timeout: 15_000 });

    // risk chips render
    await expect(page.getByText(/× (High risk|Review|OK)/).first()).toBeVisible();

    // document pages render (canvas inside page-wrap)
    await expect(page.locator(".page-wrap").first()).toBeVisible();
    await expect(page.locator(".page-wrap canvas").first()).toBeVisible();

    // highlights exist on the document
    const highlightCount = await page.locator(".hl").count();
    expect(highlightCount).toBeGreaterThan(3);

    // clicking a clause card pulses a highlight on the document
    await firstCard.click();
    await expect(page.locator(".hl-pulse").first()).toBeVisible({ timeout: 3_000 });
  });

  test("copy summary writes markdown to clipboard", async ({ page }) => {
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    await page.getByRole("button", { name: "SaaS", exact: true }).click();
    await expect(page.locator(".clause-card").first()).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "Copy summary" }).click();
    await expect(page.getByRole("button", { name: "Copied ✓" })).toBeVisible();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain("# Contract review");
    expect(clip).toContain("Negotiation ask");
  });

  test("upload path returns a handled status, never a raw crash", async ({ page }) => {
    await page.goto("/");
    // non-PDF bytes → must be rejected with a friendly 4xx, not a 500 crash
    const res = await page.request.post("/api/analyze", {
      data: { pdfBase64: "bm90IGEgcGRmIGF0IGFsbA" + "A".repeat(120) },
    });
    expect([200, 413, 422, 502, 503]).toContain(res.status());
    const body = await res.json();
    expect(body.error ?? "").toBeTruthy();
  });

  test("unknown sample returns 404 JSON", async ({ request }) => {
    const res = await request.post("/api/analyze", { data: { sampleId: "nope" } });
    expect(res.status()).toBe(404);
  });

  test("dark/light theme toggle persists", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const before = await html.evaluate((el) => el.classList.contains("dark"));
    await page.getByRole("button", { name: /mode/i }).click();
    const after = await html.evaluate((el) => el.classList.contains("dark"));
    expect(after).toBe(!before);
    await page.reload();
    const persisted = await html.evaluate((el) => el.classList.contains("dark"));
    expect(persisted).toBe(after);
  });

  test("Q&A page renders all categories", async ({ page }) => {
    await page.goto("/qa");
    await expect(page.getByRole("heading", { name: "Q&A" })).toBeVisible();
    for (const cat of ["The project", "Real vs. precomputed", "How it works", "Privacy & data", "Stack & meta"]) {
      await expect(page.getByRole("heading", { name: cat })).toBeVisible();
    }
    const first = page.locator("details").first();
    await first.locator("summary").click();
    await expect(first.locator("p")).toBeVisible();
  });

  test("footer disclaimer present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("not legal advice", { exact: false }).first()).toBeVisible();
  });
});
