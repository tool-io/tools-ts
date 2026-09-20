import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateMonteCarloIntegration,
  monteCarloIntegrationExample as example,
} from "./tool.js";

describe("one-dimensional Monte Carlo integration", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("integrates a constant exactly and reports zero empirical variance", () => {
    const result = calculateMonteCarloIntegration(
      { expression: "3", lowerBound: 2, upperBound: 5, count: 4 },
      { random: () => 0.25 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.estimate).toBe(9);
    expect(result.output.standardError).toBe(0);
    expect(result.output.abscissas).toEqual([2.75, 2.75, 2.75, 2.75]);
    expect(result.output.values).toEqual([3, 3, 3, 3]);
  });
  it("preserves reversed-bound signs and verifies two known sampled values and standard error", () => {
    const draws = [0, 0.5];
    let calls = 0;
    expect(
      tool.execute(
        { expression: "x^2", lowerBound: 1, upperBound: 0, count: 2 },
        { random: () => draws[calls++] },
      ),
    ).toEqual({
      ok: true,
      output: {
        abscissas: [1, 0.5],
        values: [1, 0.25],
        estimate: -0.625,
        standardError: 0.375,
        sampleCount: 2,
        randomness: { seed: null, source: "context" },
      },
    });
    expect(calls).toBe(2);
    const zero = tool.execute({
      expression: "x^2",
      lowerBound: 3,
      upperBound: 3,
      count: 2,
      seed: 5,
    });
    if (!zero.ok) throw new Error("Expected success");
    expect(zero.output.estimate).toBe(0);
    expect(zero.output.standardError).toBe(0);
    expect(zero.output.abscissas).toEqual([3, 3]);
  });
  it("delegates scientific functions and rejects unsafe syntax, unbound symbols, and invalid domains", () => {
    const result = tool.execute(
      {
        expression: "sin(t)",
        variable: "t",
        lowerBound: 0,
        upperBound: 1,
        count: 2,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.values).toEqual([0, 0]);
    for (const expression of ["globalThis.process", "sqrt(-1)", "y + 1"])
      expect(tool.execute({ ...example.input, expression })).toMatchObject({
        ok: false,
        error: {
          issues: [{ code: "malformed_expression", field: "expression" }],
        },
      });
    expect(tool.execute({ ...example.input, expression: "1/0" })).toMatchObject(
      {
        ok: false,
        error: { issues: [{ code: "division_by_zero", field: "expression" }] },
      },
    );
    expect(tool.execute({ ...example.input, variable: "pi" })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_variable", field: "variable" }] },
    });
  });
  it("is immutable, reproducible, and validates work and numeric bounds", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    expect(tool.execute({ ...example.input, count: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "count" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        expression: Array(100).fill("x").join("+"),
        count: 4096,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "resource_limit_exceeded", field: "expression" }],
      },
    });
    expect(
      tool.execute({ ...example.input, lowerBound: Infinity }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "lowerBound" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        lowerBound: -Number.MAX_VALUE,
        upperBound: Number.MAX_VALUE,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow", field: "upperBound" }] },
    });
  });
  it("rejects bad sources and malformed input with stable codes", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failure");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    expect(tool.execute({})).toMatchObject({
      ok: false,
      error: {
        issues: tool.inputSchema.required?.map((field) => ({
          code: "required_field",
          field,
        })),
      },
    });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
  });
});
