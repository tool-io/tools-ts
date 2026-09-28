import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-economics/discount-timing-half-cycle-factor", () => {
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
        annualRate: 0.1,
        cycleYears: 1,
        cycleIndex: 0,
        useMidpoint: false,
      }),
    ).toEqual({
      ok: true,
      output: { elapsedYears: 1, factor: 0.9090909090909091 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite annualRate", (value) =>
    expect(tool.execute({ ...example.input, annualRate: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cycleYears", (value) =>
    expect(tool.execute({ ...example.input, cycleYears: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cycleIndex", (value) =>
    expect(tool.execute({ ...example.input, cycleIndex: value }).ok).toBe(
      false,
    ),
  );
  it.each([{ annualRate: -1 }, { cycleYears: -1 }, { cycleIndex: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ annualRate: -1 }, { cycleYears: -1 }, { cycleIndex: -1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 71 independent regressions", () => {
  it("allows a valid negative effective discount rate", () => {
    expect(
      calculate({
        annualRate: -0.36,
        cycleYears: 1,
        cycleIndex: 0,
        useMidpoint: true,
      }),
    ).toEqual({ elapsedYears: 0.5, factor: 1.25 });
    expect(
      tool.execute({
        annualRate: -0.36,
        cycleYears: 1,
        cycleIndex: 0,
        useMidpoint: true,
      }),
    ).toEqual({ ok: true, output: { elapsedYears: 0.5, factor: 1.25 } });
  });
});
