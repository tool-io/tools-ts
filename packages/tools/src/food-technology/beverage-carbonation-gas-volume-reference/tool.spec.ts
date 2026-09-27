import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("food-technology/beverage-carbonation-gas-volume-reference", () => {
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
        gasVolume: 3,
        gasPressure: 1,
        gasTemperatureKelvin: 300,
        referencePressure: 1,
        referenceTemperatureKelvin: 300,
        beverageVolume: 2,
      }),
    ).toEqual({
      ok: true,
      output: { referenceGasVolume: 3, carbonationVolumes: 1.5 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite gasVolume", (value) =>
    expect(tool.execute({ ...example.input, gasVolume: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasPressure",
    (value) =>
      expect(tool.execute({ ...example.input, gasPressure: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasTemperatureKelvin",
    (value) =>
      expect(
        tool.execute({ ...example.input, gasTemperatureKelvin: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referencePressure",
    (value) =>
      expect(
        tool.execute({ ...example.input, referencePressure: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceTemperatureKelvin",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceTemperatureKelvin: value })
          .ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite beverageVolume",
    (value) =>
      expect(tool.execute({ ...example.input, beverageVolume: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { gasVolume: -1 },
    { gasPressure: 0 },
    { gasTemperatureKelvin: 0 },
    { referencePressure: 0 },
    { referenceTemperatureKelvin: 0 },
    { beverageVolume: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { gasVolume: -1 },
    { gasPressure: 0 },
    { gasTemperatureKelvin: 0 },
    { referencePressure: 0 },
    { referenceTemperatureKelvin: 0 },
    { beverageVolume: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
