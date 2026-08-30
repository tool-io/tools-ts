import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, lowCardinalityCategoryListerInputSchema, lowCardinalityCategoryListerOutputSchema } from "./index.js";
describe("csv/low-cardinality-category-lister", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, lowCardinalityCategoryListerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, lowCardinalityCategoryListerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "b\na\nb",
      "delimiter": ",",
      "hasHeader": false,
      "maxCategories": 2
    })).toEqual({ ok: true, output: {
      "columns": [
        {
          "column": 0,
          "values": [
            "b",
            "a"
          ]
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "h",
      "delimiter": ",",
      "hasHeader": true,
      "maxCategories": 2
    })).toEqual({ ok: true, output: {
      "columns": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
