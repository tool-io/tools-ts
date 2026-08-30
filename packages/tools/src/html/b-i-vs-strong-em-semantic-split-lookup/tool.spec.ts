import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, bIVsStrongEmSemanticSplitLookupInputSchema, bIVsStrongEmSemanticSplitLookupOutputSchema } from "./index.js";
describe("html/b-i-vs-strong-em-semantic-split-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, bIVsStrongEmSemanticSplitLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, bIVsStrongEmSemanticSplitLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "tag": "b"
})).toEqual({ ok: true, output: {
  "meaning": "attention"
} });
    expect(tool.execute({
  "tag": "strong"
})).toEqual({ ok: true, output: {
  "meaning": "importance"
} });
    expect(tool.execute({
  "tag": "em"
})).toEqual({ ok: true, output: {
  "meaning": "stress-emphasis"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "tag", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
