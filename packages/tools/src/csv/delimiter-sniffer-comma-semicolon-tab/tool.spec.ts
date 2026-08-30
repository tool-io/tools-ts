import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, delimiterSnifferCommaSemicolonTabInputSchema, delimiterSnifferCommaSemicolonTabOutputSchema } from "./index.js";
describe("csv/delimiter-sniffer-comma-semicolon-tab", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, delimiterSnifferCommaSemicolonTabInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, delimiterSnifferCommaSemicolonTabOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a,b;c\nd,e;f"
    })).toEqual({ ok: true, output: {
      "delimiter": "",
      "ambiguous": true,
      "candidates": [
        {
          "delimiter": ",",
          "modalWidth": 2,
          "matchingRecords": 2,
          "recordCount": 2
        },
        {
          "delimiter": ";",
          "modalWidth": 2,
          "matchingRecords": 2,
          "recordCount": 2
        }
      ]
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": ""
    })).toEqual({ ok: true, output: {
      "delimiter": "",
      "ambiguous": true,
      "candidates": []
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
