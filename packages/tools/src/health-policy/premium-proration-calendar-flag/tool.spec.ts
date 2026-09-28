import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-policy/premium-proration-calendar-flag", () => {
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
      tool.execute({
        premium: 120,
        calendarCoveredDays: 15,
        calendarPeriodDays: 31,
        suppliedCoveredBasisDays: 14,
        suppliedPeriodBasisDays: 28,
        useCalendar: false,
      }),
    ).toEqual({ ok: true, output: { fraction: 0.5, proratedPremium: 60 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite premium", (value) =>
    expect(tool.execute({ ...example.input, premium: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite calendarCoveredDays",
    (value) =>
      expect(
        tool.execute({ ...example.input, calendarCoveredDays: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite calendarPeriodDays",
    (value) =>
      expect(
        tool.execute({ ...example.input, calendarPeriodDays: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedCoveredBasisDays",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedCoveredBasisDays: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedPeriodBasisDays",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedPeriodBasisDays: value }).ok,
      ).toBe(false),
  );
  it.each([
    { premium: -1 },
    { calendarCoveredDays: -1 },
    { calendarPeriodDays: 0 },
    { suppliedCoveredBasisDays: -1 },
    { suppliedPeriodBasisDays: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { premium: -1 },
    { calendarCoveredDays: -1 },
    { calendarPeriodDays: 0 },
    { suppliedCoveredBasisDays: -1 },
    { suppliedPeriodBasisDays: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
