import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, excelXfd16384ColumnLimitCheckerInputSchema, excelXfd16384ColumnLimitCheckerOutputSchema } from "./index.js";
describe("csv/excel-xfd-16384-column-limit-checker", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, excelXfd16384ColumnLimitCheckerInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, excelXfd16384ColumnLimitCheckerOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "columnCount": 16385
    })).toEqual({ ok: true, output: {
      "fits": false,
      "limit": 16384,
      "remaining": 0,
      "lastColumn": "XFE"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "columnCount": 0
    })).toEqual({ ok: true, output: {
      "fits": true,
      "limit": 16384,
      "remaining": 16384,
      "lastColumn": ""
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "columnCount", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
