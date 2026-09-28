import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-policy/insurance-premium-family-tier-change", () => {
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
        oldMonthly: 80,
        newMonthly: 120,
        oldDays: 15,
        newDays: 15,
        monthDays: 30,
        credits: 10,
      }),
    ).toEqual({
      ok: true,
      output: { oldProration: 40, newProration: 60, netPremium: 90 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite oldMonthly", (value) =>
    expect(tool.execute({ ...example.input, oldMonthly: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite newMonthly", (value) =>
    expect(tool.execute({ ...example.input, newMonthly: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite oldDays", (value) =>
    expect(tool.execute({ ...example.input, oldDays: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite newDays", (value) =>
    expect(tool.execute({ ...example.input, newDays: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite monthDays", (value) =>
    expect(tool.execute({ ...example.input, monthDays: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite credits", (value) =>
    expect(tool.execute({ ...example.input, credits: value }).ok).toBe(false),
  );
  it.each([
    { oldMonthly: -1 },
    { newMonthly: -1 },
    { oldDays: -1 },
    { newDays: -1 },
    { monthDays: 0 },
    { monthDays: 32 },
    { credits: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { oldMonthly: -1 },
    { newMonthly: -1 },
    { oldDays: -1 },
    { newDays: -1 },
    { monthDays: 0 },
    { monthDays: 32 },
    { credits: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
