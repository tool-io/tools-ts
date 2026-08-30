import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema, validateToolContract } from "../../core/contract.js";
import { example, runSitemapCounter, sitemapCounterTool, sitemapCounterInputSchema, sitemapCounterOutputSchema } from "./index.js";
describe("Sitemap Entry Counter", () => {
  it("executes the canonical example and publishes a portable contract", () => {
    expect(validateToolContract(sitemapCounterTool)).toEqual([]);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
    expect(matchesToolJsonSchema(example.input, sitemapCounterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sitemapCounterOutputSchema)).toBe(true);
    expect(runSitemapCounter(example.input)).toEqual({ok: true, output: example.output});
  });
  it("matches independent case 1", () => expect(runSitemapCounter({"xml":"<s:sitemapindex xmlns:s=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><s:sitemap><s:loc>https://example.com/s.xml</s:loc></s:sitemap></s:sitemapindex>"})).toEqual({ok: true, output: {"urls":0,"sitemaps":1,"kind":"sitemapindex"}}));
  it("reports invalid case 1 at its input field", () => {
    const result = runSitemapCounter({"xml":"<urlset><url/></urlset>"});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]).toMatchObject({field: "xml", code: "malformed_sitemap"});
  });
  it("rejects a non-object input with a stable issue", () => {
    const result = runSitemapCounter(null);
    expect(result).toMatchObject({ok: false, error: {code: "invalid_input", issues: [{code: "object_required", field: ""}]}});
  });

});
