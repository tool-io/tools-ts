import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, excelSerialDateToIsoConverterInputSchema, excelSerialDateToIsoConverterOutputSchema } from "./index.js";
describe("csv/excel-serial-date-to-iso-converter", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, excelSerialDateToIsoConverterInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, excelSerialDateToIsoConverterOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "serial": 39267,
      "system": "1904"
    })).toEqual({ ok: true, output: {
      "isoDate": "2011-07-05"
    } });
    expect(tool.execute({
      "serial": 61,
      "system": "1900"
    })).toEqual({ ok: true, output: {
      "isoDate": "1900-03-01"
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "serial": 1,
      "system": "1900"
    })).toEqual({ ok: true, output: {
      "isoDate": "1900-01-01"
    } });
    expect(tool.execute({
      "serial": 0,
      "system": "1904"
    })).toEqual({ ok: true, output: {
      "isoDate": "1904-01-01"
    } });
    expect(tool.execute({
      "serial": 2958465,
      "system": "1900"
    })).toEqual({ ok: true, output: {
      "isoDate": "9999-12-31"
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "serial", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
      "serial": 60,
      "system": "1900"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "serial", code: "fictitious_date" }] } });
    expect(tool.execute({
      "serial": 0,
      "system": "1900"
    })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "serial", code: "date_range" }] } });
  });

  it("preserves the independently known leap-bug boundary", () => {
    expect(tool.execute({ serial: 59, system: "1900" })).toEqual({ ok: true, output: { isoDate: "1900-02-28" } });
  });
});
