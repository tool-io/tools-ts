import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("aquaponics/aquaponic-feed-nutrient-supplied-factor", () => {
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
        feedMass: 50,
        dryFraction: 0.8,
        nutrientFraction: 0.05,
        exportedFraction: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { nutrientInventory: 2, retainedInventory: 1 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite feedMass", (value) =>
    expect(tool.execute({ ...example.input, feedMass: value }).ok).toBe(false),
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
    "rejects nonfinite exportedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, exportedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { feedMass: -1 },
    { dryFraction: -1 },
    { dryFraction: 2 },
    { nutrientFraction: -1 },
    { nutrientFraction: 2 },
    { exportedFraction: -1 },
    { exportedFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { feedMass: -1 },
    { dryFraction: -1 },
    { dryFraction: 2 },
    { nutrientFraction: -1 },
    { nutrientFraction: 2 },
    { exportedFraction: -1 },
    { exportedFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
