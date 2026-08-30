import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, brVsWbrBreakOpportunityDiffInputSchema, brVsWbrBreakOpportunityDiffOutputSchema } from "./index.js";
describe("html/br-vs-wbr-break-opportunity-diff", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, brVsWbrBreakOpportunityDiffInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, brVsWbrBreakOpportunityDiffOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "tag": "br"
})).toEqual({ ok: true, output: {
  "lineBreak": true,
  "optionalBreakOpportunity": false
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tag", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
