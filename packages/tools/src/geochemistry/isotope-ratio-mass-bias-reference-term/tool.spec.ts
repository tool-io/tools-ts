import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geochemistry/isotope-ratio-mass-bias-reference-term", () => {
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
        measuredRatio: 2,
        referenceRatio: 2,
        numeratorToDenominatorMassRatio: 3,
      }),
    ).toEqual({ ok: true, output: { massBiasExponent: 0 } });
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
    "rejects nonfinite measuredRatio",
    (value) =>
      expect(tool.execute({ ...example.input, measuredRatio: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceRatio",
    (value) =>
      expect(tool.execute({ ...example.input, referenceRatio: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite numeratorToDenominatorMassRatio",
    (value) =>
      expect(
        tool.execute({
          ...example.input,
          numeratorToDenominatorMassRatio: value,
        }).ok,
      ).toBe(false),
  );
  it.each([
    { measuredRatio: 0 },
    { referenceRatio: 0 },
    { numeratorToDenominatorMassRatio: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { measuredRatio: 0 },
    { referenceRatio: 0 },
    { numeratorToDenominatorMassRatio: 0 },
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
      ...{
        measuredRatio: 2,
        referenceRatio: 2,
        numeratorToDenominatorMassRatio: 2,
      },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { massBiasExponent: 0 },
    });
    expect(calculate(input)).toEqual({ massBiasExponent: 0 });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = {
      ...example.input,
      ...{ numeratorToDenominatorMassRatio: 1 },
    };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          { field: "numeratorToDenominatorMassRatio", code: "invalid_domain" },
        ],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
