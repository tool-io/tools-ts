import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("food-technology/spray-drying-feed-solids-balance-term", () => {
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
        feedMass: 200,
        feedSolidsFraction: 0.25,
        collectedMass: 40,
        powderSolidsFraction: 1,
      }),
    ).toEqual({
      ok: true,
      output: { feedSolids: 50, collectedSolids: 40, recovery: 0.8 },
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
    "rejects nonfinite feedSolidsFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, feedSolidsFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite collectedMass",
    (value) =>
      expect(tool.execute({ ...example.input, collectedMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite powderSolidsFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, powderSolidsFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { feedMass: 0 },
    { feedSolidsFraction: 0 },
    { feedSolidsFraction: 2 },
    { collectedMass: -1 },
    { powderSolidsFraction: -1 },
    { powderSolidsFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { feedMass: 0 },
    { feedSolidsFraction: 0 },
    { feedSolidsFraction: 2 },
    { collectedMass: -1 },
    { powderSolidsFraction: -1 },
    { powderSolidsFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
