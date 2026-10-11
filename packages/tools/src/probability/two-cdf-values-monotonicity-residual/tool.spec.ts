import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("probability/two-cdf-values-monotonicity-residual", () => {
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
        lowerArgument: 2,
        upperArgument: 4,
        lowerCdf: 0.8,
        upperCdf: 0.3,
      }),
    ).toEqual({ ok: true, output: { cdfIncrement: -0.5, monotone: false } });
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
    "rejects nonfinite lowerArgument",
    (value) =>
      expect(tool.execute({ ...example.input, lowerArgument: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite upperArgument",
    (value) =>
      expect(tool.execute({ ...example.input, upperArgument: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite lowerCdf", (value) =>
    expect(tool.execute({ ...example.input, lowerCdf: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite upperCdf", (value) =>
    expect(tool.execute({ ...example.input, upperCdf: value }).ok).toBe(false),
  );
  it.each([
    { lowerCdf: -1 },
    { lowerCdf: 2 },
    { upperCdf: -1 },
    { upperCdf: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { lowerCdf: -1 },
    { lowerCdf: 2 },
    { upperCdf: -1 },
    { upperCdf: 2 },
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
      ...{ lowerArgument: 0, upperArgument: 1, lowerCdf: 0.5, upperCdf: 0.5 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { cdfIncrement: 0, monotone: true },
    });
    expect(calculate(input)).toEqual({ cdfIncrement: 0, monotone: true });
  });
});
