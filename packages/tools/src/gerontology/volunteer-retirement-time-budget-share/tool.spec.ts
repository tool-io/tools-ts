import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("gerontology/volunteer-retirement-time-budget-share", () => {
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
        volunteerHours: 8,
        paidHours: 0,
        careHours: 12,
        discretionaryBudget: 30,
        concurrentHours: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        grossHours: 20,
        uniqueHours: 20,
        volunteerShareOfBudget: 0.26666666666666666,
        remainingBudget: 10,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite volunteerHours",
    (value) =>
      expect(tool.execute({ ...example.input, volunteerHours: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite paidHours", (value) =>
    expect(tool.execute({ ...example.input, paidHours: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite careHours", (value) =>
    expect(tool.execute({ ...example.input, careHours: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite discretionaryBudget",
    (value) =>
      expect(
        tool.execute({ ...example.input, discretionaryBudget: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite concurrentHours",
    (value) =>
      expect(
        tool.execute({ ...example.input, concurrentHours: value }).ok,
      ).toBe(false),
  );
  it.each([
    { volunteerHours: -1 },
    { paidHours: -1 },
    { careHours: -1 },
    { discretionaryBudget: 0 },
    { concurrentHours: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { volunteerHours: -1 },
    { paidHours: -1 },
    { careHours: -1 },
    { discretionaryBudget: 0 },
    { concurrentHours: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
