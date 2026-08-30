import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, filterRowsColumnEqualsValueInputSchema, filterRowsColumnEqualsValueOutputSchema } from "./index.js";
describe("csv/filter-rows-column-equals-value", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, filterRowsColumnEqualsValueInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, filterRowsColumnEqualsValueOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a\nA\n a",
      "delimiter": ",",
      "hasHeader": false,
      "column": 0,
      "value": "a"
    })).toEqual({ ok: true, output: {
      "csv": "a"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "h",
      "delimiter": ",",
      "hasHeader": true,
      "column": 0,
      "value": "x"
    })).toEqual({ ok: true, output: {
      "csv": "h"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "csv": "a,b",
      "delimiter": ",",
      "hasHeader": false,
      "column": 2,
      "value": "a"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "column", code: "column_range" }] } });
  });

});
