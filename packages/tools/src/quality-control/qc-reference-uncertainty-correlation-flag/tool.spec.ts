import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("quality-control/qc-reference-uncertainty-correlation-flag", () => {
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
        resultUncertainty: 3,
        referenceUncertainty: 4,
        suppliedCorrelation: 1,
        useCorrelation: false,
      }),
    ).toEqual({ ok: true, output: { differenceUncertainty: 5 } });
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
    "rejects nonfinite resultUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, resultUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceUncertainty",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceUncertainty: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedCorrelation",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedCorrelation: value }).ok,
      ).toBe(false),
  );
  it.each([
    { resultUncertainty: -1 },
    { referenceUncertainty: -1 },
    { suppliedCorrelation: -2 },
    { suppliedCorrelation: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { resultUncertainty: -1 },
    { referenceUncertainty: -1 },
    { suppliedCorrelation: -2 },
    { suppliedCorrelation: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 70 independent regressions", () => {
  it("cancels fully correlated large equal uncertainties without squaring overflow", () => {
    expect(
      calculate({
        resultUncertainty: 1e200,
        referenceUncertainty: 1e200,
        suppliedCorrelation: 1,
        useCorrelation: true,
      }),
    ).toEqual({ differenceUncertainty: 0 });
    expect(
      tool.execute({
        resultUncertainty: 1e200,
        referenceUncertainty: 1e200,
        suppliedCorrelation: 1,
        useCorrelation: true,
      }),
    ).toEqual({ ok: true, output: { differenceUncertainty: 0 } });
  });
  it("retains independent large uncertainties", () => {
    const input = {
      resultUncertainty: 3e200,
      referenceUncertainty: 4e200,
      suppliedCorrelation: 0,
      useCorrelation: false,
    };
    const output = calculate(input);
    // Independent 3-4-5 result, scaled to permit the expected binary64 error.
    expect(output.differenceUncertainty / 1e200).toBeCloseTo(5, 14);
    expect(tool.execute(input)).toEqual({ ok: true, output });
  });
});
