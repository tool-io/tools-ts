import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("vector/vector-normalized-dot-residual", () => {
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
      tool.execute({ first: [1, 0], second: [-1, 0], suppliedCosine: -1 }),
    ).toEqual({ ok: true, output: { cosine: -1, residual: 0 } });
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
    "rejects nonfinite suppliedCosine",
    (value) =>
      expect(tool.execute({ ...example.input, suppliedCosine: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ first: [0, 0] }, { second: [1] }, { suppliedCosine: -2 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ first: [0, 0] }, { second: [1] }, { suppliedCosine: -2 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

import { SimpleToolError as RegressionInputError } from "../../core/simple.js";

describe("batch 72 independent regressions", () => {
  it("normalizes vectors whose raw norm overflows", () => {
    const input = {
      first: [1e308, 1e308, 1e308, 1e308],
      second: [1e308, 1e308, 1e308, 1e308],
      suppliedCosine: 1,
    };
    const output = calculate(input);
    expect(output.cosine).toBeCloseTo(1, 14);
    expect(output.residual).toBeCloseTo(0, 14);
    expect(tool.execute(input)).toEqual({ ok: true, output });
  });
  it("identifies a zero-vector field", () => {
    const input = { ...example.input, ...{ first: [0, 0] } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ code: "invalid_domain", field: "first" }],
      },
    });
    expect(() => calculate(input)).toThrowError(RegressionInputError);
  });
});
