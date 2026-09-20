import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  attentionMatrixTestCaseExample as example,
  calculateAttentionMatrixTestCase,
} from "./tool.js";

describe("Random Attention Matrix Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateAttentionMatrixTestCase(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("has normalized nonnegative weights and independently weighted value outputs", () => {
    const result = tool.execute({
      ...example.input,
      queryCount: 5,
      keyCount: 7,
      keyWidth: 3,
      valueWidth: 4,
      valueDivisor: 2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (let row = 0; row < 5; row += 1) {
      const weights = result.output.weights[row];
      expect(weights).toHaveLength(7);
      expect(weights.every((value) => value >= 0 && value <= 1)).toBe(true);
      expect(weights.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 13);
      for (let column = 0; column < 4; column += 1)
        expect(result.output.attendedValues[row][column]).toBeCloseTo(
          result.output.values.reduce(
            (sum, vector, index) => sum + vector[column] * weights[index],
            0,
          ),
          10,
        );
    }
    expect(result.output.dimensions).toEqual({
      queries: { rows: 5, columns: 3 },
      keys: { rows: 7, columns: 3 },
      values: { rows: 7, columns: 4 },
    });
  });
  it("supports one key and zero-score uniform attention without a masking convention", () => {
    const one = tool.execute({ ...example.input, keyCount: 1 });
    expect(one.ok).toBe(true);
    if (one.ok) {
      expect(one.output.weights).toEqual([[1], [1]]);
      expect(one.output.attendedValues).toEqual([
        one.output.values[0],
        one.output.values[0],
      ]);
    }
    expect(
      tool.execute({ ...example.input, minimumValue: 0, maximumValue: 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        weights: [
          [0.5, 0.5],
          [0.5, 0.5],
        ],
        attendedValues: [[0], [0]],
      },
    });
  });
  it("rejects unsupported shapes/ranges and real entry or score overflow", () => {
    for (const change of [
      { queryCount: 0 },
      { keyCount: 33 },
      { keyWidth: 17 },
      { valueWidth: 0 },
      { minimumValue: 3 },
      { valueDivisor: 0 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        minimumValue: 1,
        maximumValue: 1,
        valueDivisor: 1e-200,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow" }] },
    });
  });
});
