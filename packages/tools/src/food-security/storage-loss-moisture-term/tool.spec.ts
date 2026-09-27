import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("food-security/storage-loss-moisture-term", () => {
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
        initialWetMass: 100,
        finalWetMass: 100,
        initialDryFraction: 0.8,
        finalDryFraction: 0.8,
      }),
    ).toEqual({
      ok: true,
      output: { initialDryMass: 80, finalDryMass: 80, dryMassLoss: 0 },
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
    "rejects nonfinite initialWetMass",
    (value) =>
      expect(tool.execute({ ...example.input, initialWetMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite finalWetMass",
    (value) =>
      expect(tool.execute({ ...example.input, finalWetMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite initialDryFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, initialDryFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite finalDryFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, finalDryFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { initialWetMass: -1 },
    { finalWetMass: -1 },
    { initialDryFraction: -1 },
    { initialDryFraction: 2 },
    { finalDryFraction: -1 },
    { finalDryFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { initialWetMass: -1 },
    { finalWetMass: -1 },
    { initialDryFraction: -1 },
    { initialDryFraction: 2 },
    { finalDryFraction: -1 },
    { finalDryFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
