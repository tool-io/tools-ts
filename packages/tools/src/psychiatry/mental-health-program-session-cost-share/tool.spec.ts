import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("psychiatry/mental-health-program-session-cost-share", () => {
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
        fixedProgramCost: 600,
        sessionCount: 6,
        attendeesPerSession: 10,
        facilitatorCostPerSession: 100,
        subsidyFraction: 0.25,
      }),
    ).toEqual({
      ok: true,
      output: { totalCost: 1200, grossPerAttendance: 20, netPerAttendance: 15 },
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
    "rejects nonfinite fixedProgramCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, fixedProgramCost: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sessionCount",
    (value) =>
      expect(tool.execute({ ...example.input, sessionCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite attendeesPerSession",
    (value) =>
      expect(
        tool.execute({ ...example.input, attendeesPerSession: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite facilitatorCostPerSession",
    (value) =>
      expect(
        tool.execute({ ...example.input, facilitatorCostPerSession: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite subsidyFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, subsidyFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { fixedProgramCost: -1 },
    { sessionCount: 0 },
    { attendeesPerSession: 0 },
    { facilitatorCostPerSession: -1 },
    { subsidyFraction: -1 },
    { subsidyFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { fixedProgramCost: -1 },
    { sessionCount: 0 },
    { attendeesPerSession: 0 },
    { facilitatorCostPerSession: -1 },
    { subsidyFraction: -1 },
    { subsidyFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
