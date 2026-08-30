import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, cellLengthMinMaxPerColumnInputSchema, cellLengthMinMaxPerColumnOutputSchema } from "./index.js";
describe("csv/cell-length-min-max-per-column", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, cellLengthMinMaxPerColumnInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, cellLengthMinMaxPerColumnOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a,b\nc,",
      "delimiter": ",",
      "hasHeader": false
    })).toEqual({ ok: true, output: {
      "columns": [
        {
          "column": 0,
          "count": 2,
          "minimum": 1,
          "maximum": 1
        },
        {
          "column": 1,
          "count": 2,
          "minimum": 0,
          "maximum": 1
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "h",
      "delimiter": ",",
      "hasHeader": true
    })).toEqual({ ok: true, output: {
      "columns": [
        {
          "column": 0,
          "count": 0,
          "minimum": 0,
          "maximum": 0
        }
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
