import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sortRowsColumnNumericEuDecimalAwareInputSchema, sortRowsColumnNumericEuDecimalAwareOutputSchema } from "./index.js";
describe("csv/sort-rows-column-numeric-eu-decimal-aware", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sortRowsColumnNumericEuDecimalAwareInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sortRowsColumnNumericEuDecimalAwareOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "2,0\n-1,5",
      "delimiter": ";",
      "hasHeader": false,
      "column": 0,
      "direction": "descending"
    })).toEqual({ ok: true, output: {
      "csv": "2,0\n-1,5"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "amount",
      "delimiter": ";",
      "hasHeader": true,
      "column": 0,
      "direction": "ascending"
    })).toEqual({ ok: true, output: {
      "csv": "amount"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "csv": "12.34,50",
      "delimiter": ";",
      "hasHeader": false,
      "column": 0,
      "direction": "ascending"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv.0.0", code: "invalid_decimal" }] } });
  });

});
