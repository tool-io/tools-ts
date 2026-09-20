import { describe, it, expect } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  example,
  calculateFractionOrderingCardSet as calculate,
  runFractionOrderingCardSet as run,
} from "./index.js";
describe("random/fraction-ordering-card-set", () => {
  it("lightweight negative-zero numerator bounds preserve exact zero fractions", () => {
    const input = {
      count: 2,
      maximumDenominator: 1,
      minimumNumerator: -0,
      maximumNumerator: -0,
      seed: 42,
    };
    expect(run(input)).toEqual({
      ok: true,
      output: {
        cards: [
          {
            numerator: 0,
            denominator: 1,
            reducedNumerator: 0,
            reducedDenominator: 1,
          },
          {
            numerator: 0,
            denominator: 1,
            reducedNumerator: 0,
            reducedDenominator: 1,
          },
        ],
        order: [0, 1],
        equalAdjacent: [true],
        randomness: { seed: 42, source: "seed" },
      },
    });
    expect(Object.is(input.minimumNumerator, -0)).toBe(true);
  });
  it("lightweight canonical calculation, index runner, contract and JSON schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(run(example.input)).toEqual({ ok: true, output: example.output });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("lightweight replay, source validation, seed precedence and immutability", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(run(input)).toEqual(run(example.input));
    expect(input).toEqual(example.input);
    expect(
      run(input, {
        random: () => {
          throw new Error("seed wins");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = input;
    expect(run(unseeded)).toEqual(run(unseeded));
    for (const bad of [NaN, 1, -0.1])
      expect(run(unseeded, { random: () => bad })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      run(unseeded, {
        random: () => {
          throw new Error("source failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
    let calls = 0;
    const generated = run(unseeded, {
      random: () => {
        calls++;
        return 0.25;
      },
    });
    expect(generated.ok).toBe(true);
    expect(calls).toBeGreaterThan(0);
    if (generated.ok) {
      expect(generated.output.randomness).toEqual({
        seed: null,
        source: "context",
      });
      expect(matchesToolJsonSchema(generated.output, tool.outputSchema)).toBe(
        true,
      );
      expect(JSON.parse(JSON.stringify(generated.output))).toEqual(
        generated.output,
      );
    }
  });
  it("lightweight full missing-field and stable boundary diagnostics", () => {
    const missing = run({});
    if (missing.ok) throw new Error("Expected missing input errors");
    expect(
      missing.error.issues.map((issue) => ({
        field: issue.field,
        code: issue.code,
      })),
    ).toEqual([
      { field: "count", code: "required_field" },
      { field: "maximumDenominator", code: "required_field" },
      { field: "minimumNumerator", code: "required_field" },
      { field: "maximumNumerator", code: "required_field" },
    ]);
    expect(run({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(run({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
    expect(run({ ...example.input, maximumNumerator: -3 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumNumerator", code: "invalid_range" }] },
    });
  });
  it("lightweight independent model case and invariant", () => {
    const r = run({
      count: 3,
      maximumDenominator: 2,
      minimumNumerator: 0,
      maximumNumerator: 0,
    });
    if (!r.ok) throw new Error("Expected ties");
    expect(r.output.order).toEqual([0, 1, 2]);
    expect(r.output.equalAdjacent).toEqual([true, true]);
    expect(r.output.cards.map((c) => c.reducedDenominator)).toEqual([1, 1, 1]);
  });
});
