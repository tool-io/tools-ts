import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("hydrometeorology/snow-water-depth-contribution", () => {
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
        snowDepth: 50,
        suppliedSnowDensity: 100,
        suppliedWaterDensity: 1000,
        coveredFraction: 1,
      }),
    ).toEqual({ ok: true, output: { waterDepth: 5, weightedWaterDepth: 5 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite snowDepth", (value) =>
    expect(tool.execute({ ...example.input, snowDepth: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedSnowDensity",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedSnowDensity: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedWaterDensity",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedWaterDensity: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite coveredFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, coveredFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { snowDepth: -1 },
    { suppliedSnowDensity: -1 },
    { suppliedWaterDensity: 0 },
    { coveredFraction: -1 },
    { coveredFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { snowDepth: -1 },
    { suppliedSnowDensity: -1 },
    { suppliedWaterDensity: 0 },
    { coveredFraction: -1 },
    { coveredFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
