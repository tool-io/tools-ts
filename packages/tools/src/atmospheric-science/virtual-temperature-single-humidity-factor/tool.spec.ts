import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("atmospheric-science/virtual-temperature-single-humidity-factor", () => {
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
        temperatureKelvin: 280,
        specificHumidityFraction: 0,
        suppliedVaporToDryGasConstantRatio: 1.6,
      }),
    ).toEqual({
      ok: true,
      output: { virtualTemperatureKelvin: 280, factor: 1 },
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
    "rejects nonfinite temperatureKelvin",
    (value) =>
      expect(
        tool.execute({ ...example.input, temperatureKelvin: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite specificHumidityFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, specificHumidityFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedVaporToDryGasConstantRatio",
    (value) =>
      expect(
        tool.execute({
          ...example.input,
          suppliedVaporToDryGasConstantRatio: value,
        }).ok,
      ).toBe(false),
  );
  it.each([
    { temperatureKelvin: 0 },
    { specificHumidityFraction: -1 },
    { specificHumidityFraction: 2 },
    { suppliedVaporToDryGasConstantRatio: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { temperatureKelvin: 0 },
    { specificHumidityFraction: -1 },
    { specificHumidityFraction: 2 },
    { suppliedVaporToDryGasConstantRatio: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{
        temperatureKelvin: 300,
        specificHumidityFraction: 0,
        suppliedVaporToDryGasConstantRatio: 1.6,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { virtualTemperatureKelvin: 300, factor: 1 },
    });
    expect(calculate(input)).toEqual({
      virtualTemperatureKelvin: 300,
      factor: 1,
    });
  });
});
