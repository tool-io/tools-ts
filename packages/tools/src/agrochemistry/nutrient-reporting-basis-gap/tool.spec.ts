import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agrochemistry/nutrient-reporting-basis-gap", () => {
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
        reportedFraction: 0.2,
        dryMatterFraction: 0.5,
        referenceFraction: 0.1,
        sourceIsDryBasis: false,
        referenceIsDryBasis: false,
      }),
    ).toEqual({
      ok: true,
      output: { sourceWetFraction: 0.2, referenceWetFraction: 0.1, gap: 0.1 },
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
    "rejects nonfinite reportedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, reportedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dryMatterFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, dryMatterFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { reportedFraction: -1 },
    { reportedFraction: 2 },
    { dryMatterFraction: -1 },
    { dryMatterFraction: 2 },
    { referenceFraction: -1 },
    { referenceFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { reportedFraction: -1 },
    { reportedFraction: 2 },
    { dryMatterFraction: -1 },
    { dryMatterFraction: 2 },
    { referenceFraction: -1 },
    { referenceFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
