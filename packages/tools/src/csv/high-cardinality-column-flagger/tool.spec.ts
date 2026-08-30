import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, highCardinalityColumnFlaggerInputSchema, highCardinalityColumnFlaggerOutputSchema } from "./index.js";
describe("csv/high-cardinality-column-flagger", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, highCardinalityColumnFlaggerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, highCardinalityColumnFlaggerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a\na",
      "delimiter": ",",
      "hasHeader": false,
      "threshold": 0.5
    })).toEqual({ ok: true, output: {
      "columns": [
        {
          "column": 0,
          "distinctCount": 1,
          "observedCount": 2,
          "ratio": 0.5,
          "high": false
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "h",
      "delimiter": ",",
      "hasHeader": true,
      "threshold": 0
    })).toEqual({ ok: true, output: {
      "columns": [
        {
          "column": 0,
          "distinctCount": 0,
          "observedCount": 0,
          "ratio": 0,
          "high": false
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
