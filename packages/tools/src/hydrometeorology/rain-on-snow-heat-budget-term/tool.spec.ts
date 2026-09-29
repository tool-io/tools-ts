import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("hydrometeorology/rain-on-snow-heat-budget-term", () => {
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
        rainMassKg: 20,
        rainTemperatureC: 10,
        waterSpecificHeat: 4200,
        latentHeatFusion: 336000,
        availableSnowKg: 1,
      }),
    ).toEqual({
      ok: true,
      output: { sensibleHeatJ: 840000, potentialMeltKg: 2.5, boundedMeltKg: 1 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rainMassKg", (value) =>
    expect(tool.execute({ ...example.input, rainMassKg: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rainTemperatureC",
    (value) =>
      expect(
        tool.execute({ ...example.input, rainTemperatureC: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite waterSpecificHeat",
    (value) =>
      expect(
        tool.execute({ ...example.input, waterSpecificHeat: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite latentHeatFusion",
    (value) =>
      expect(
        tool.execute({ ...example.input, latentHeatFusion: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite availableSnowKg",
    (value) =>
      expect(
        tool.execute({ ...example.input, availableSnowKg: value }).ok,
      ).toBe(false),
  );
  it.each([
    { rainMassKg: -1 },
    { rainTemperatureC: -1 },
    { waterSpecificHeat: 0 },
    { latentHeatFusion: 0 },
    { availableSnowKg: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { rainMassKg: -1 },
    { rainTemperatureC: -1 },
    { waterSpecificHeat: 0 },
    { latentHeatFusion: 0 },
    { availableSnowKg: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
