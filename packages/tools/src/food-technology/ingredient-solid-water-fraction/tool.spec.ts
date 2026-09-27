import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("food-technology/ingredient-solid-water-fraction", () => {
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
        ingredientMass: 0,
        measuredWaterFraction: 0.5,
        massUnit: "g",
      }),
    ).toEqual({ ok: true, output: { waterMass: 0, solidMass: 0, unit: "g" } });
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
    "rejects nonfinite ingredientMass",
    (value) =>
      expect(tool.execute({ ...example.input, ingredientMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite measuredWaterFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, measuredWaterFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { ingredientMass: -1 },
    { measuredWaterFraction: -1 },
    { measuredWaterFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { ingredientMass: -1 },
    { measuredWaterFraction: -1 },
    { measuredWaterFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("explicit pure-water endpoints retain mass units", () => {
    const output = calculate({
      ingredientMass: 12,
      measuredWaterFraction: 1,
      massUnit: "kg",
    });
    expect(output).toMatchObject({ waterMass: 12, solidMass: 0, unit: "kg" });
    expect(
      tool.execute({
        ingredientMass: 12,
        measuredWaterFraction: 1,
        massUnit: "kg",
      }),
    ).toEqual({ ok: true, output });
  });
});
