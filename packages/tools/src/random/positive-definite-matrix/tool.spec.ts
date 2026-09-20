import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  positiveDefiniteMatrixExample as example,
  calculatePositiveDefiniteMatrix,
} from "./tool.js";

describe("Random Positive-Definite Matrix Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculatePositiveDefiniteMatrix(example.input)).toEqual({
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
  it("has the independently known two-by-two Gram matrix and Cholesky factor", () => {
    const draws = [0, 0.25, 0.5, 0.75];
    let i = 0;
    const result = tool.execute(
      { size: 2, minimumInteger: 1, maximumInteger: 4, diagonalShift: 1 },
      { random: () => draws[i++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.source).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(result.output.matrix).toEqual([
      [11, 14],
      [14, 21],
    ]);
    expect(result.output.lower[0][0]).toBeCloseTo(Math.sqrt(11), 14);
    expect(result.output.lower[1][1]).toBeGreaterThan(0);
    expect(result.output.relativeReconstructionError).toBeLessThan(1e-14);
  });
  it("checks symmetry, factor reconstruction and positive quadratic forms independently", () => {
    for (let seed = 0; seed < 10; seed += 1) {
      const result = tool.execute({ ...example.input, size: 4, seed });
      if (!result.ok) throw new Error("Expected success");
      const { matrix, lower } = result.output;
      for (let i = 0; i < 4; i += 1)
        for (let j = 0; j < 4; j += 1) {
          expect(matrix[i][j]).toBe(matrix[j][i]);
          expect(
            lower[i].reduce((sum, v, k) => sum + v * lower[j][k], 0),
          ).toBeCloseTo(matrix[i][j], 10);
        }
      for (const x of [
        [1, 0, 0, 0],
        [1, -2, 3, -4],
      ])
        expect(
          x.reduce(
            (s, v, i) => s + v * matrix[i].reduce((t, m, j) => t + m * x[j], 0),
            0,
          ),
        ).toBeGreaterThan(0);
    }
  });
  it("rejects zero shifts and reports a positive shift that disappears numerically", () => {
    expect(tool.execute({ ...example.input, diagonalShift: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "diagonalShift" }] },
    });
    expect(
      tool.execute({
        size: 2,
        minimumInteger: 1,
        maximumInteger: 1,
        diagonalShift: Number.MIN_VALUE,
        seed: 42,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "diagonalShift", code: "numerical_cholesky_failure" },
        ],
      },
    });
    expect(tool.execute({ ...example.input, minimumInteger: 4 })).toMatchObject(
      { ok: false, error: { issues: [{ field: "maximumInteger" }] } },
    );
  });
});
