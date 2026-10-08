import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("demographic-economics/retirement-age-cohort-date", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(
      tool.execute({ birthYear: 2000, birthMonth: 2, retirementAgeYears: 60 }),
    ).toEqual({
      ok: true,
      output: { retirementYear: 2060, retirementMonth: 2 },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite birthYear", (value) =>
    expect(tool.execute({ ...example.input, birthYear: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite birthMonth", (value) =>
    expect(tool.execute({ ...example.input, birthMonth: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite retirementAgeYears",
    (value) =>
      expect(
        tool.execute({ ...example.input, retirementAgeYears: value }).ok,
      ).toBe(false),
  );
  it.each([
    { birthYear: 0 },
    { birthYear: 10000 },
    { birthMonth: 0 },
    { birthMonth: 13 },
    { retirementAgeYears: -1 },
    { retirementAgeYears: 9999 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { birthYear: 0 },
    { birthYear: 10000 },
    { birthMonth: 0 },
    { birthMonth: 13 },
    { retirementAgeYears: -1 },
    { retirementAgeYears: 9999 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 76 reviewed regressions", () => {
  it("adds a supplied age without inventing a statutory maximum", () => {
    expect(
      calculate({ birthYear: 1000, birthMonth: 12, retirementAgeYears: 200 }),
    ).toEqual({ retirementYear: 1200, retirementMonth: 12 });
  });
  it("rejects an unrepresentable output year at the age field", () => {
    expect(
      tool.execute({ birthYear: 9990, birthMonth: 12, retirementAgeYears: 20 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "retirementAgeYears", code: "invalid_domain" }],
      },
    });
  });
});
