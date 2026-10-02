import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("physiology/sweat-rate-evaporation-mass-factor", () => {
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
        secretedMassKg: 0.2,
        evaporatedFraction: 0.75,
        latentHeatJPerKg: 2400000,
        durationSeconds: 1200,
      }),
    ).toEqual({
      ok: true,
      output: {
        evaporatedMassKg: 0.15000000000000002,
        heatRemovedJ: 360000.00000000006,
        meanCoolingW: 300.00000000000006,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secretedMassKg",
    (value) =>
      expect(tool.execute({ ...example.input, secretedMassKg: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite evaporatedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, evaporatedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite latentHeatJPerKg",
    (value) =>
      expect(
        tool.execute({ ...example.input, latentHeatJPerKg: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite durationSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, durationSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([
    { secretedMassKg: -1 },
    { evaporatedFraction: -1 },
    { evaporatedFraction: 2 },
    { latentHeatJPerKg: 0 },
    { durationSeconds: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { secretedMassKg: -1 },
    { evaporatedFraction: -1 },
    { evaporatedFraction: 2 },
    { latentHeatJPerKg: 0 },
    { durationSeconds: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
