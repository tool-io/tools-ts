import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agrophysics/soil-thermal-diffusivity-capacity-term", () => {
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
        conductivity: 1,
        dryBulkDensity: 1200,
        massHeatCapacity: 1000,
        waterVolumeFraction: 0.1,
        waterVolumeHeatCapacity: 4000000,
      }),
    ).toEqual({
      ok: true,
      output: { volumeHeatCapacity: 1600000, diffusivity: 6.25e-7 },
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
    "rejects nonfinite conductivity",
    (value) =>
      expect(tool.execute({ ...example.input, conductivity: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dryBulkDensity",
    (value) =>
      expect(tool.execute({ ...example.input, dryBulkDensity: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite massHeatCapacity",
    (value) =>
      expect(
        tool.execute({ ...example.input, massHeatCapacity: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite waterVolumeFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, waterVolumeFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite waterVolumeHeatCapacity",
    (value) =>
      expect(
        tool.execute({ ...example.input, waterVolumeHeatCapacity: value }).ok,
      ).toBe(false),
  );
  it.each([
    { conductivity: -1 },
    { dryBulkDensity: -1 },
    { massHeatCapacity: -1 },
    { waterVolumeFraction: -1 },
    { waterVolumeHeatCapacity: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { conductivity: -1 },
    { dryBulkDensity: -1 },
    { massHeatCapacity: -1 },
    { waterVolumeFraction: -1 },
    { waterVolumeHeatCapacity: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
