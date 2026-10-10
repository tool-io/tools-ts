import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("homeopathy/dilution-step-expected-molecule-fraction", () => {
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
        initialExpectedMolecules: 400,
        retainedFraction: 0.5,
        steps: 3,
      }),
    ).toEqual({
      ok: true,
      output: { expectedMolecules: 50, remainingFraction: 0.125 },
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
    "rejects nonfinite initialExpectedMolecules",
    (value) =>
      expect(
        tool.execute({ ...example.input, initialExpectedMolecules: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite retainedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, retainedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite steps", (value) =>
    expect(tool.execute({ ...example.input, steps: value }).ok).toBe(false),
  );
  it.each([
    { initialExpectedMolecules: -1 },
    { retainedFraction: -1 },
    { retainedFraction: 2 },
    { steps: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { initialExpectedMolecules: -1 },
    { retainedFraction: -1 },
    { retainedFraction: 2 },
    { steps: -1 },
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
      ...{ initialExpectedMolecules: 40, retainedFraction: 0, steps: 0 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { expectedMolecules: 40, remainingFraction: 1 },
    });
    expect(calculate(input)).toEqual({
      expectedMolecules: 40,
      remainingFraction: 1,
    });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ initialExpectedMolecules: 40, retainedFraction: 0, steps: 1 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { expectedMolecules: 0, remainingFraction: 0 },
    });
    expect(calculate(input)).toEqual({
      expectedMolecules: 0,
      remainingFraction: 0,
    });
  });
});
