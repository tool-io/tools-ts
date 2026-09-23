import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biomonitoring/biomonitoring-lablot-reference-uncertainty", () => {
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
        first: 20,
        second: 23,
        firstUncertainty: 2,
        secondUncertainty: 1,
        correlation: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        difference: 3,
        differenceUncertainty: 2.23606797749979,
        normalizedDifference: 1.3416407864998738,
      },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite first", (value) =>
    expect(tool.execute({ ...example.input, first: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite second", (value) =>
    expect(tool.execute({ ...example.input, second: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite firstUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, firstUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, secondUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite correlation",
    (value) =>
      expect(tool.execute({ ...example.input, correlation: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { firstUncertainty: 0, secondUncertainty: 0 },
    { firstUncertainty: 1, secondUncertainty: 1, correlation: 1 },
    { correlation: 2 },
    { firstUncertainty: -1 },
    { correlation: -2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { firstUncertainty: 0, secondUncertainty: 0 },
    { firstUncertainty: 1, secondUncertainty: 1, correlation: 1 },
    { correlation: 2 },
    { firstUncertainty: -1 },
    { correlation: -2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 67 review regressions", () => {
  it("combines large finite uncertainties without squaring overflow", () => {
    const r = calculate({
      first: 1,
      second: 3,
      firstUncertainty: 1e200,
      secondUncertainty: 1e200,
      correlation: 0,
    });
    expect(r.differenceUncertainty / 1e200).toBeCloseTo(1.4142135623730951, 14);
    expect(r.normalizedDifference).toBeGreaterThan(0);
    expect(r.normalizedDifference / 1e-200).toBeCloseTo(1.414213562373095, 14);
  });
  it("allows perfectly correlated unequal uncertainties", () => {
    expect(
      calculate({
        first: 1,
        second: 4,
        firstUncertainty: 2,
        secondUncertainty: 1,
        correlation: 1,
      }),
    ).toEqual({
      difference: 3,
      differenceUncertainty: 1,
      normalizedDifference: 3,
    });
  });
});
