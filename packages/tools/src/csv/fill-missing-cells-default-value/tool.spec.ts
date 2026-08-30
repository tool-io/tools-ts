import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, fillMissingCellsDefaultValueInputSchema, fillMissingCellsDefaultValueOutputSchema } from "./index.js";
describe("csv/fill-missing-cells-default-value", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, fillMissingCellsDefaultValueInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, fillMissingCellsDefaultValueOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "csv": "a",
      "delimiter": ",",
      "width": 3,
      "defaultValue": "x,y"
    })).toEqual({ ok: true, output: {
      "csv": "a,\"x,y\",\"x,y\""
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "csv": "",
      "delimiter": ",",
      "width": 2,
      "defaultValue": "NA"
    })).toEqual({ ok: true, output: {
      "csv": ""
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "csv", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "csv": "a,b,c",
      "delimiter": ",",
      "width": 2,
      "defaultValue": "NA"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "width", code: "would_truncate" }] } });
    expect(tool.execute({
      "csv": "a\nb",
      "delimiter": ",",
      "width": 10000,
      "defaultValue": ""
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "width", code: "resource_limit" }] } });
  });

});
