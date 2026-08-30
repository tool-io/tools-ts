import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, colgroupSpanCountCalculatorInputSchema, colgroupSpanCountCalculatorOutputSchema } from "./index.js";
describe("html/colgroup-span-count-calculator", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, colgroupSpanCountCalculatorInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, colgroupSpanCountCalculatorOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "hasGroupSpan": true,
  "groupSpan": 4,
  "childSpans": []
})).toEqual({ ok: true, output: {
  "columnCount": 4,
  "groupSpanAllowed": true
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "hasGroupSpan": false,
  "groupSpan": 8,
  "childSpans": []
})).toEqual({ ok: true, output: {
  "columnCount": 1,
  "groupSpanAllowed": true
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "hasGroupSpan", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
