import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("industrial-pharmacy/coating-weight-gain-solids-fraction-term", () => {
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
        coreMass: 80,
        finalMass: 90,
        volatileMass: 2,
        appliedLiquidMass: 40,
        solidsFraction: 0.25,
      }),
    ).toEqual({
      ok: true,
      output: { dryGain: 8, theoreticalSolids: 10, transferFraction: 0.8 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite coreMass", (value) =>
    expect(tool.execute({ ...example.input, coreMass: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite finalMass", (value) =>
    expect(tool.execute({ ...example.input, finalMass: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite volatileMass",
    (value) =>
      expect(tool.execute({ ...example.input, volatileMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite appliedLiquidMass",
    (value) =>
      expect(
        tool.execute({ ...example.input, appliedLiquidMass: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite solidsFraction",
    (value) =>
      expect(tool.execute({ ...example.input, solidsFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { coreMass: -1 },
    { finalMass: -1 },
    { volatileMass: -1 },
    { appliedLiquidMass: 0 },
    { solidsFraction: 0 },
    { solidsFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { coreMass: -1 },
    { finalMass: -1 },
    { volatileMass: -1 },
    { appliedLiquidMass: 0 },
    { solidsFraction: 0 },
    { solidsFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
