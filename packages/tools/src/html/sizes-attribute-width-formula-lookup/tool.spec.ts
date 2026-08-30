import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sizesAttributeWidthFormulaLookupInputSchema, sizesAttributeWidthFormulaLookupOutputSchema } from "./index.js";
describe("html/sizes-attribute-width-formula-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sizesAttributeWidthFormulaLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sizesAttributeWidthFormulaLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "matches": [
    false
  ],
  "lengthsPx": [
    300
  ],
  "viewportWidthPx": 800
})).toEqual({ ok: true, output: {
  "clauseIndex": -1,
  "sourceSizePx": 800,
  "usedDefault": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "matches": [],
  "lengthsPx": [],
  "viewportWidthPx": 0
})).toEqual({ ok: true, output: {
  "clauseIndex": -1,
  "sourceSizePx": 0,
  "usedDefault": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "matches", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({ ...example.input, lengthsPx: [] })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "lengthsPx", code: "length_mismatch" }] } });
  });

});
