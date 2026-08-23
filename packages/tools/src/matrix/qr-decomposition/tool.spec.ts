import { describe, expect, it } from "vitest";
import {
  calculateQrDecomposition,
  qrDecompositionExample,
  runQrDecomposition,
} from "./tool.js";

describe("matrix/qr-decomposition", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runQrDecomposition(qrDecompositionExample.input)).toEqual({
      ok: true,
      output: qrDecompositionExample.output,
    });
  });

  it("rejects empty and non-square input with a structured error", () => {
    expect(runQrDecomposition({ matrix: [] }).ok).toBe(false);
    const ragged = runQrDecomposition({ matrix: [[1, 2], [3]] });
    expect(ragged.ok).toBe(false);
    if (!ragged.ok) expect(ragged.error.issues[0]?.code).toBe("invalid_matrix");
  });

  it("returns Q orthogonal and R upper triangular with Q·R = A", () => {
    const result = calculateQrDecomposition({
      matrix: [
        [12, -51, 4],
        [6, 167, -68],
        [-4, 24, -41],
      ],
    });
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        if (j > i) expect(Math.abs(result.r[i]![j]!)).toBeGreaterThanOrEqual(0);
        else if (j < i) expect(Math.abs(result.r[i]![j]!)).toBeLessThan(1e-10);
      }
      for (let j = 0; j < 3; j += 1) {
        const dot = [0, 1, 2].reduce(
          (sum, k) => sum + result.q[k]![i]! * result.q[k]![j]!,
          0,
        );
        expect(dot).toBeCloseTo(i === j ? 1 : 0, 10);
      }
    }
    for (let i = 0; i < 3; i += 1)
      for (let j = 0; j < 3; j += 1) {
        const product = [0, 1, 2].reduce(
          (sum, k) => sum + result.q[i]![k]! * result.r[k]![j]!,
          0,
        );
        expect(product).toBeCloseTo(
          [
            [12, -51, 4],
            [6, 167, -68],
            [-4, 24, -41],
          ][i]![j]!,
          8,
        );
      }
  });
});
