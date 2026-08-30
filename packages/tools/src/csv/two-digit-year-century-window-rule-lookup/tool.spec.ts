import { describe, expect, it } from "vitest";
import { matchesToolJsonSchema } from "../../core/contract.js";
import tool, { example, twoDigitYearCenturyWindowRuleLookupInputSchema, twoDigitYearCenturyWindowRuleLookupOutputSchema } from "./index.js";
describe("csv/two-digit-year-century-window-rule-lookup", () => {
  it("executes the canonical example through the public subpath", () => {
    expect(tool.execute(example.input)).toEqual({ ok: true, output: example.output });
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches portable schemas", () => {
    expect(matchesToolJsonSchema(example.input, twoDigitYearCenturyWindowRuleLookupInputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, twoDigitYearCenturyWindowRuleLookupOutputSchema)).toBe(true);
  });
  it("handles independently known values", () => {
    expect(tool.execute({
      "twoDigitYear": 30,
      "windowStartYear": 1930
    })).toEqual({ ok: true, output: {
      "year": 1930
    } });
    expect(tool.execute({
      "twoDigitYear": 0,
      "windowStartYear": 1950
    })).toEqual({ ok: true, output: {
      "year": 2000
    } });
  });
  it("handles boundaries and structure", () => {
    expect(tool.execute({
      "twoDigitYear": 0,
      "windowStartYear": 1
    })).toEqual({ ok: true, output: {
      "year": 100
    } });
    expect(tool.execute({
      "twoDigitYear": 99,
      "windowStartYear": 9900
    })).toEqual({ ok: true, output: {
      "year": 9999
    } });
  });
  it("returns stable errors", () => {
    expect(tool.execute(undefined)).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "", code: "object_required" }] } });
    expect(tool.execute({})).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "twoDigitYear", code: "invalid_type" }] } });
    expect(tool.execute({ ...example.input, unexpected: 1 })).toMatchObject({ ok: false, error: { code: "invalid_input", issues: [{ field: "unexpected", code: "unknown_field" }] } });
  });

});
