import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("quality-control/calibrant-potency-basis-factor", () => {
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
        weighedMass: 10,
        suppliedPotencyFraction: 0.8,
        moistureFraction: 0.1,
        potencyOnDryBasis: false,
      }),
    ).toEqual({ ok: true, output: { activeEquivalent: 8 } });
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
    "rejects nonfinite weighedMass",
    (value) =>
      expect(tool.execute({ ...example.input, weighedMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedPotencyFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedPotencyFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite moistureFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, moistureFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { weighedMass: -1 },
    { suppliedPotencyFraction: -1 },
    { suppliedPotencyFraction: 2 },
    { moistureFraction: -1 },
    { moistureFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { weighedMass: -1 },
    { suppliedPotencyFraction: -1 },
    { suppliedPotencyFraction: 2 },
    { moistureFraction: -1 },
    { moistureFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("dry-basis potency excludes supplied moisture", () => {
    const output = calculate({
      weighedMass: 20,
      suppliedPotencyFraction: 0.5,
      moistureFraction: 0.25,
      potencyOnDryBasis: true,
    });
    expect(output).toMatchObject({ activeEquivalent: 7.5 });
    expect(
      tool.execute({
        weighedMass: 20,
        suppliedPotencyFraction: 0.5,
        moistureFraction: 0.25,
        potencyOnDryBasis: true,
      }),
    ).toEqual({ ok: true, output });
  });
});
