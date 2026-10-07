import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("chemical-engineering/single-effect-evaporation-water-balance", () => {
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
        feedMassFlow: 80,
        feedSolidsFraction: 0.25,
        productSolidsFraction: 0.25,
      }),
    ).toEqual({
      ok: true,
      output: { productMassFlow: 80, evaporatedWaterFlow: 0 },
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
    "rejects nonfinite feedMassFlow",
    (value) =>
      expect(tool.execute({ ...example.input, feedMassFlow: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite feedSolidsFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, feedSolidsFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite productSolidsFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, productSolidsFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { feedMassFlow: -1 },
    { feedSolidsFraction: -1 },
    { feedSolidsFraction: 2 },
    { productSolidsFraction: 0 },
    { productSolidsFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { feedMassFlow: -1 },
    { feedSolidsFraction: -1 },
    { feedSolidsFraction: 2 },
    { productSolidsFraction: 0 },
    { productSolidsFraction: 2 },
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
        feedMassFlow: 100,
        feedSolidsFraction: 0.2,
        productSolidsFraction: 0.5,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { productMassFlow: 40, evaporatedWaterFlow: 60 },
    });
    expect(calculate(input)).toEqual({
      productMassFlow: 40,
      evaporatedWaterFlow: 60,
    });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = {
      ...example.input,
      ...{ feedSolidsFraction: 0.5, productSolidsFraction: 0.2 },
    };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "productSolidsFraction", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
