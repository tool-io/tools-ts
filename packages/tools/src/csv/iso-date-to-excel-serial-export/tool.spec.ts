import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, isoDateToExcelSerialExportInputSchema, isoDateToExcelSerialExportOutputSchema } from "./index.js";
describe("csv/iso-date-to-excel-serial-export", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, isoDateToExcelSerialExportInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, isoDateToExcelSerialExportOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "isoDate": "2011-07-05",
      "system": "1904"
    })).toEqual({ ok: true, output: {
      "serial": 39267
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "isoDate": "1900-02-28",
      "system": "1900"
    })).toEqual({ ok: true, output: {
      "serial": 59
    } });
    expect(tool.execute({
      "isoDate": "1900-03-01",
      "system": "1900"
    })).toEqual({ ok: true, output: {
      "serial": 61
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "isoDate", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "isoDate": "1900-02-29",
      "system": "1900"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "isoDate", code: "invalid_date" }] } });
    expect(tool.execute({
      "isoDate": "1903-12-31",
      "system": "1904"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "isoDate", code: "date_range" }] } });
  });

});
