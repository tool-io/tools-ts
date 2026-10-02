import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacodynamics/pd-log-concentration-effect-elasticity", () => {
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
    expect(tool.execute({ fraction: 0.8, hill: 1, maximumEffect: 5 })).toEqual({
      ok: true,
      output: {
        fractionSlope: 0.15999999999999998,
        effectSlope: 0.7999999999999998,
        relativeElasticity: 0.19999999999999996,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite fraction", (value) =>
    expect(tool.execute({ ...example.input, fraction: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite hill", (value) =>
    expect(tool.execute({ ...example.input, hill: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite maximumEffect",
    (value) =>
      expect(tool.execute({ ...example.input, maximumEffect: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ fraction: -1 }, { fraction: 2 }, { hill: 0 }])(
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
  it.each([{ fraction: -1 }, { fraction: 2 }, { hill: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 67 review regressions", () => {
  it.each([0, 1])(
    "returns the zero endpoint slope without an overflowing intermediate product: %j",
    (fraction) => {
      const r = calculate({ fraction, hill: 1e308, maximumEffect: 1e308 });
      expect(r.fractionSlope).toBe(0);
      expect(r.effectSlope).toBe(0);
      expect(r.relativeElasticity).toBe(fraction === 0 ? 1e308 : 0);
    },
  );
});
