import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical matrix/singular-value-decomposition result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));
describe("Jacobi SVD", () => {
  it("sorts diagonal singular values", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output.singularValues).toEqual([4, 3]);
  });
  it.each([
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    [
      [1, 2, 3],
      [4, 5, 6],
    ],
    [
      [1, 0],
      [0, 0],
    ],
  ])("reconstructs rectangular or rank-deficient input", (...rows) => {
    const matrix = rows as number[][];
    const result = tool.execute({ matrix });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const { u, singularValues, vt } = result.output;
    for (let i = 0; i < matrix.length; i++)
      for (let j = 0; j < matrix[0]!.length; j++) {
        const reconstructed = singularValues.reduce(
          (sum, s, k) => sum + u[i]![k]! * s * vt[k]![j]!,
          0,
        );
        expect(reconstructed).toBeCloseTo(matrix[i]![j]!, 8);
      }
  });
});
