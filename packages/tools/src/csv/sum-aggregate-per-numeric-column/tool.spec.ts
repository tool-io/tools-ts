import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, sumAggregatePerNumericColumnInputSchema, sumAggregatePerNumericColumnOutputSchema } from "./index.js";
describe("csv/sum-aggregate-per-numeric-column", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, sumAggregatePerNumericColumnInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, sumAggregatePerNumericColumnOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "9007199254740993\n1",
      "delimiter": ",",
      "hasHeader": false,
      "columnIndices": [
        0
      ]
    })).toEqual({ ok: true, output: {
      "columns": [
        {
          "column": 0,
          "count": 2,
          "sum": "9007199254740994"
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "amount",
      "delimiter": ",",
      "hasHeader": true,
      "columnIndices": [
        0
      ]
    })).toEqual({ ok: true, output: {
      "columns": [
        {
          "column": 0,
          "count": 0,
          "sum": "0"
        }
      ]
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "csv": "oops",
      "delimiter": ",",
      "hasHeader": false,
      "columnIndices": [
        0
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv.0.0", code: "invalid_decimal" }] } });
    expect(tool.execute({
      "csv": "1",
      "delimiter": ",",
      "hasHeader": false,
      "columnIndices": [
        0,
        0
      ]
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "columnIndices", code: "duplicate_columns" }] } });
  });

});
