import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("evolutionary-biology/coalescent-generation-scale", () => {
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
        generations: 0,
        effectivePopulationSize: 100,
        ploidyMultiplier: 1,
      }),
    ).toEqual({ ok: true, output: { scaledTime: 0 } });
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
    "rejects nonfinite generations",
    (value) =>
      expect(tool.execute({ ...example.input, generations: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite effectivePopulationSize",
    (value) =>
      expect(
        tool.execute({ ...example.input, effectivePopulationSize: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite ploidyMultiplier",
    (value) =>
      expect(
        tool.execute({ ...example.input, ploidyMultiplier: value }).ok,
      ).toBe(false),
  );
  it.each([
    { generations: -1 },
    { effectivePopulationSize: 0 },
    { ploidyMultiplier: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { generations: -1 },
    { effectivePopulationSize: 0 },
    { ploidyMultiplier: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 77 reviewed regressions", () => {
  it("avoids silently returning zero when only the denominator product overflows", () => {
    expect(
      calculate({
        generations: 1e308,
        effectivePopulationSize: 1e308,
        ploidyMultiplier: 2,
      }),
    ).toEqual({ scaledTime: 0.5 });
  });
});
