import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, a1RangeCellCountExpanderInputSchema, a1RangeCellCountExpanderOutputSchema } from "./index.js";
describe("csv/a1-range-cell-count-expander", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, a1RangeCellCountExpanderInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, a1RangeCellCountExpanderOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "range": "Z1:AA1"
    })).toEqual({ ok: true, output: {
      "cellCount": 2,
      "addresses": [
        "Z1",
        "AA1"
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "range": "$A$1:$A$1"
    })).toEqual({ ok: true, output: {
      "cellCount": 1,
      "addresses": [
        "A1"
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "range", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "range": "C3:B2"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "range", code: "reversed_range" }] } });
    expect(tool.execute({
      "range": "A1:A5001"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "range", code: "resource_limit" }] } });
  });

});
