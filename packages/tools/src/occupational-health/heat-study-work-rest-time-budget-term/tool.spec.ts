import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("occupational-health/heat-study-work-rest-time-budget-term", () => {
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
        workMinutes: 30,
        restMinutes: 10,
        cycles: 2,
        transitionMinutes: 0,
        shiftMinutes: 90,
      }),
    ).toEqual({
      ok: true,
      output: {
        scheduledMinutes: 80,
        workShare: 0.6666666666666666,
        unallocatedMinutes: 10,
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
    "rejects nonfinite workMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, workMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite restMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, restMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cycles", (value) =>
    expect(tool.execute({ ...example.input, cycles: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite transitionMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, transitionMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite shiftMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, shiftMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { workMinutes: -1 },
    { restMinutes: -1 },
    { cycles: -1 },
    { transitionMinutes: -1 },
    { shiftMinutes: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { workMinutes: -1 },
    { restMinutes: -1 },
    { cycles: -1 },
    { transitionMinutes: -1 },
    { shiftMinutes: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
