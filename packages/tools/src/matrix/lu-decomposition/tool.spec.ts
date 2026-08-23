import { describe, expect, it } from "vitest";
import {
  luDecompositionExample,
  calculateLuDecomposition,
  runLuDecomposition,
} from "./tool.js";

describe("matrix/lu-decomposition", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLuDecomposition(luDecompositionExample.input)).toEqual({
      ok: true,
      output: luDecompositionExample.output,
    });
  });
  it("rejects invalid input (not_square_matrix)", () => {
    expect(
      runLuDecomposition({
        matrix: [
          [1, 2, 3],
          [4, 5, 6],
        ],
      }).ok,
    ).toBe(false);
  });
  it("satisfies P times A equals L times U", () => {
    const result = runLuDecomposition({
      matrix: [
        [4, 3],
        [6, 3],
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const a = [
      [4, 3],
      [6, 3],
    ];
    const lower = result.output.lower as readonly number[][];
    const upper = result.output.upper as readonly number[][];
    const product = a.map((_, i) =>
      upper[0]!.map((_, j) =>
        lower.reduce((sum, _, k) => sum + lower[i]![k]! * upper[k]![j]!, 0),
      ),
    );
    (result.output.permutation as readonly number[]).forEach((rowIndex, i) =>
      (a[rowIndex] as readonly number[]).forEach((value, j) =>
        expect(Math.abs(product[i]![j]! - value)).toBeLessThan(1e-9),
      ),
    );
  });
});
