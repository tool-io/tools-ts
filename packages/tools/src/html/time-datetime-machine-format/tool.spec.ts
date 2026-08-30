import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, timeDatetimeMachineFormatInputSchema, timeDatetimeMachineFormatOutputSchema } from "./index.js";
describe("html/time-datetime-machine-format", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, timeDatetimeMachineFormatInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, timeDatetimeMachineFormatOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
  "mode": "date",
  "year": 2024,
  "month": 2,
  "day": 29,
  "hour": 14,
  "minute": 5,
  "second": 9,
  "millisecond": 120,
  "offsetMinutes": 330
})).toEqual({ ok: true, output: {
  "datetime": "2024-02-29"
} });
    expect(tool.execute({
  "mode": "global-datetime",
  "year": 2024,
  "month": 2,
  "day": 29,
  "hour": 14,
  "minute": 5,
  "second": 9,
  "millisecond": 0,
  "offsetMinutes": 0
})).toEqual({ ok: true, output: {
  "datetime": "2024-02-29T14:05:09Z"
} });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
  "mode": "date",
  "year": 1,
  "month": 1,
  "day": 1,
  "hour": 14,
  "minute": 5,
  "second": 9,
  "millisecond": 120,
  "offsetMinutes": 330
})).toEqual({ ok: true, output: {
  "datetime": "0001-01-01"
} });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "mode", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
    expect(tool.execute({
  "mode": "global-datetime",
  "year": 1900,
  "month": 2,
  "day": 29,
  "hour": 14,
  "minute": 5,
  "second": 9,
  "millisecond": 120,
  "offsetMinutes": 330
})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "day", code: "invalid_date" }] } });
  });

  it("uses proleptic Gregorian century leap rules and valid offset bounds", () => {
    expect(tool.execute({ ...example.input, year: 2000, millisecond: 1, offsetMinutes: -1439 })).toEqual({ ok: true, output: { datetime: "2000-02-29T14:05:09.001-23:59" } });
    expect(tool.execute({ ...example.input, year: 2100 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "day", code: "invalid_date" }] } });
  });
});
