import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("human-geography/community-access-travel-cost-income-share", () => {
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
        oneWayFare: 5,
        weeklyVisits: 3,
        paidTravelHoursPerVisit: 0.5,
        hourlyOpportunityCost: 20,
        weeklyIncome: 600,
      }),
    ).toEqual({
      ok: true,
      output: {
        weeklyCashCost: 30,
        weeklyGeneralizedCost: 60,
        incomeShare: 0.1,
      },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite oneWayFare", (value) =>
    expect(tool.execute({ ...example.input, oneWayFare: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite weeklyVisits",
    (value) =>
      expect(tool.execute({ ...example.input, weeklyVisits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite paidTravelHoursPerVisit",
    (value) =>
      expect(
        tool.execute({ ...example.input, paidTravelHoursPerVisit: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite hourlyOpportunityCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, hourlyOpportunityCost: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite weeklyIncome",
    (value) =>
      expect(tool.execute({ ...example.input, weeklyIncome: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { oneWayFare: -1 },
    { weeklyVisits: -1 },
    { paidTravelHoursPerVisit: -1 },
    { hourlyOpportunityCost: -1 },
    { weeklyIncome: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { oneWayFare: -1 },
    { weeklyVisits: -1 },
    { paidTravelHoursPerVisit: -1 },
    { hourlyOpportunityCost: -1 },
    { weeklyIncome: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
