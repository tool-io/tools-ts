import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("cryogenics/boiloff-liquid-mass-gas-volume-factor", () => {
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
        liquidVolume: 0.02,
        liquidDensity: 1000,
        gasMolarMass: 0.04,
        gasConstant: 8.31446261815324,
        gasTemperatureK: 250,
        gasPressure: 100000,
      }),
    ).toEqual({
      ok: true,
      output: { mass: 20, moles: 500, gasVolume: 10.39307827269155 },
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
    "rejects nonfinite liquidVolume",
    (value) =>
      expect(tool.execute({ ...example.input, liquidVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite liquidDensity",
    (value) =>
      expect(tool.execute({ ...example.input, liquidDensity: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasMolarMass",
    (value) =>
      expect(tool.execute({ ...example.input, gasMolarMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasConstant",
    (value) =>
      expect(tool.execute({ ...example.input, gasConstant: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasTemperatureK",
    (value) =>
      expect(
        tool.execute({ ...example.input, gasTemperatureK: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasPressure",
    (value) =>
      expect(tool.execute({ ...example.input, gasPressure: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { liquidVolume: -1 },
    { liquidDensity: 0 },
    { gasMolarMass: 0 },
    { gasConstant: 0 },
    { gasTemperatureK: 0 },
    { gasPressure: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });

  it.each([
    { liquidVolume: -1 },
    { liquidDensity: 0 },
    { gasMolarMass: 0 },
    { gasConstant: 0 },
    { gasTemperatureK: 0 },
    { gasPressure: 0 },
  ])("reviewed-domain direct validation %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrow();
    const result = tool.execute({ ...example.input, ...change });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect([
        "invalid_field",
        "invalid_domain",
        "result_out_of_range",
      ]).toContain(result.error.issues[0].code);
  });
});
