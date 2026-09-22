import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("atmospheric-chemistry/aerosol-bin-log-width", () => {
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
      tool.execute({ lowerDiameter: 2, upperDiameter: 8, logBase: 2 }),
    ).toEqual({ ok: true, output: { width: 2 } });
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
    "rejects nonfinite lowerDiameter",
    (value) =>
      expect(tool.execute({ ...example.input, lowerDiameter: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite upperDiameter",
    (value) =>
      expect(tool.execute({ ...example.input, upperDiameter: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite logBase", (value) =>
    expect(tool.execute({ ...example.input, logBase: value }).ok).toBe(false),
  );
  it.each([{ lowerDiameter: 0 }, { logBase: 1 }])(
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
  it.each([{ lowerDiameter: 0 }, { logBase: 1 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 72 independent regressions", () => {
  it("preserves adjacent positive bin widths", () => {
    const input = {
      lowerDiameter: 1,
      upperDiameter: 1 + Number.EPSILON,
      logBase: 2,
    };
    const output = calculate(input);
    expect(output.width / Number.EPSILON).toBeCloseTo(1 / Math.LN2, 14);
    expect(output.width).toBeGreaterThan(0);
    expect(tool.execute(input)).toEqual({ ok: true, output });
  });
  it("keeps extreme diameter ratios in the logarithmic domain", () => {
    const input = {
      lowerDiameter: Number.MIN_VALUE,
      upperDiameter: Number.MAX_VALUE,
      logBase: 2,
    };
    const output = calculate(input);
    expect(output.width).toBeCloseTo(2098, 10);
    expect(tool.execute(input)).toEqual({ ok: true, output });
  });
});
