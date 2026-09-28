import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geophysics/magnetotelluric-apparent-resistivity-term", () => {
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
        impedanceReal: 1,
        impedanceImaginary: 1,
        angularFrequency: 4,
        permeability: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { apparentResistivity: 1, phaseRadians: 0.7853981633974483 },
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
    "rejects nonfinite impedanceReal",
    (value) =>
      expect(tool.execute({ ...example.input, impedanceReal: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite impedanceImaginary",
    (value) =>
      expect(
        tool.execute({ ...example.input, impedanceImaginary: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite angularFrequency",
    (value) =>
      expect(
        tool.execute({ ...example.input, angularFrequency: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite permeability",
    (value) =>
      expect(tool.execute({ ...example.input, permeability: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { impedanceReal: 0, impedanceImaginary: 0 },
    { angularFrequency: 0 },
    { permeability: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { impedanceReal: 0, impedanceImaginary: 0 },
    { angularFrequency: 0 },
    { permeability: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 66 review regressions", () => {
  it("avoids overflowing permeability times frequency", () => {
    const r = calculate({
      impedanceReal: 1e100,
      impedanceImaginary: 0,
      angularFrequency: 1e200,
      permeability: 1e200,
    });
    expect(r.apparentResistivity).toBeGreaterThan(0);
    expect(r.apparentResistivity / 1e-200).toBeCloseTo(1, 14);
    expect(r.phaseRadians).toBe(0);
  });
  it("does not form an overflowing unnormalized complex magnitude", () => {
    const r = calculate({
      impedanceReal: 1e308,
      impedanceImaginary: 1e308,
      angularFrequency: 1e308,
      permeability: 1e308,
    });
    expect(r.apparentResistivity).toBeCloseTo(2, 14);
    expect(r.phaseRadians).toBe(Math.PI / 4);
  });
});
