import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("energy-economics/fuel-heat-price-reference-gap", () => {
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
        pricePerFuelUnit: 12,
        heatPerFuelUnit: 4,
        deliveredEfficiency: 1,
        suppliedReferencePricePerHeat: 3,
      }),
    ).toEqual({
      ok: true,
      output: { deliveredPricePerHeat: 3, referenceGap: 0 },
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
    "rejects nonfinite pricePerFuelUnit",
    (value) =>
      expect(
        tool.execute({ ...example.input, pricePerFuelUnit: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite heatPerFuelUnit",
    (value) =>
      expect(
        tool.execute({ ...example.input, heatPerFuelUnit: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite deliveredEfficiency",
    (value) =>
      expect(
        tool.execute({ ...example.input, deliveredEfficiency: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedReferencePricePerHeat",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedReferencePricePerHeat: value })
          .ok,
      ).toBe(false),
  );
  it.each([
    { pricePerFuelUnit: -1 },
    { heatPerFuelUnit: 0 },
    { deliveredEfficiency: 0 },
    { deliveredEfficiency: 2 },
    { suppliedReferencePricePerHeat: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { pricePerFuelUnit: -1 },
    { heatPerFuelUnit: 0 },
    { deliveredEfficiency: 0 },
    { deliveredEfficiency: 2 },
    { suppliedReferencePricePerHeat: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
