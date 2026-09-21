import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agrochemistry/compost-nutrient-available-supplied-factor", () => {
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
        wetMass: 500,
        dryFraction: 0.6,
        nutrientFraction: 0.01,
        suppliedAvailableFraction: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { totalNutrient: 3, availableInventory: 1.5 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite wetMass", (value) =>
    expect(tool.execute({ ...example.input, wetMass: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dryFraction",
    (value) =>
      expect(tool.execute({ ...example.input, dryFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite nutrientFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, nutrientFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedAvailableFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedAvailableFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { wetMass: -1 },
    { dryFraction: -1 },
    { dryFraction: 2 },
    { nutrientFraction: -1 },
    { nutrientFraction: 2 },
    { suppliedAvailableFraction: -1 },
    { suppliedAvailableFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { wetMass: -1 },
    { dryFraction: -1 },
    { dryFraction: 2 },
    { nutrientFraction: -1 },
    { nutrientFraction: 2 },
    { suppliedAvailableFraction: -1 },
    { suppliedAvailableFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
