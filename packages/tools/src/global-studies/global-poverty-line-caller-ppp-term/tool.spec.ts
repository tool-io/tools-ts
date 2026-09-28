import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("global-studies/global-poverty-line-caller-ppp-term", () => {
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
        dailyInternationalLine: 4,
        localCurrencyPerInternational: 1.5,
        householdWeight: 2,
        days: 20,
        observedHouseholdIncome: 300,
      }),
    ).toEqual({
      ok: true,
      output: { localPeriodLine: 240, incomeGap: 60, belowLine: false },
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dailyInternationalLine",
    (value) =>
      expect(
        tool.execute({ ...example.input, dailyInternationalLine: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite localCurrencyPerInternational",
    (value) =>
      expect(
        tool.execute({ ...example.input, localCurrencyPerInternational: value })
          .ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite householdWeight",
    (value) =>
      expect(
        tool.execute({ ...example.input, householdWeight: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite days", (value) =>
    expect(tool.execute({ ...example.input, days: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observedHouseholdIncome",
    (value) =>
      expect(
        tool.execute({ ...example.input, observedHouseholdIncome: value }).ok,
      ).toBe(false),
  );
  it.each([
    { dailyInternationalLine: -1 },
    { localCurrencyPerInternational: 0 },
    { householdWeight: 0 },
    { days: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { dailyInternationalLine: -1 },
    { localCurrencyPerInternational: 0 },
    { householdWeight: 0 },
    { days: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
