import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-economics/intervention-uptake-eligible-population-factor", () => {
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
        population: 5000,
        eligibilityFraction: 0.1,
        uptakeFraction: 0.4,
        adherenceFraction: 0.75,
      }),
    ).toEqual({
      ok: true,
      output: { eligible: 500, starts: 200, adherent: 150 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite population", (value) =>
    expect(tool.execute({ ...example.input, population: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite eligibilityFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, eligibilityFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite uptakeFraction",
    (value) =>
      expect(tool.execute({ ...example.input, uptakeFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite adherenceFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, adherenceFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { population: -1 },
    { eligibilityFraction: -1 },
    { eligibilityFraction: 2 },
    { uptakeFraction: -1 },
    { uptakeFraction: 2 },
    { adherenceFraction: -1 },
    { adherenceFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { population: -1 },
    { eligibilityFraction: -1 },
    { eligibilityFraction: 2 },
    { uptakeFraction: -1 },
    { uptakeFraction: 2 },
    { adherenceFraction: -1 },
    { adherenceFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
