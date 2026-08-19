import { describe, expect, it } from "vitest";
import {
  calculateCholeskyDecomposition,
  choleskyDecompositionExample,
  runCholeskyDecomposition,
} from "./tool.js";

describe("cholesky decomposition calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCholeskyDecomposition(choleskyDecompositionExample.input),
    ).toEqual({ ok: true, output: choleskyDecompositionExample.output });
  });

  it("returns L whose product with its transpose reconstructs the input", () => {
    const matrix = [
      [25, 15, -5],
      [15, 18, 0],
      [-5, 0, 11],
    ];
    const output = calculateCholeskyDecomposition({ matrix });
    for (let row = 0; row < matrix.length; row += 1)
      for (let column = 0; column < matrix.length; column += 1) {
        let product = 0;
        for (let k = 0; k < matrix.length; k += 1)
          product +=
            output.lower[row]![k]! * output.lower[column]![k]!;
        expect(product).toBeCloseTo(matrix[row]![column]!, 10);
      }
  });

  it("decomposes the identity into the identity", () => {
    const identity = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    expect(calculateCholeskyDecomposition({ matrix: identity })).toEqual({
      lower: identity,
    });
  });

  it("allows tiny asymmetry within the tolerance", () => {
    const nearlySymmetric = [
      [4, 12 + 5e-13],
      [12, 37],
    ];
    expect(() =>
      calculateCholeskyDecomposition({ matrix: nearlySymmetric }),
    ).not.toThrow();
    expect(() =>
      calculateCholeskyDecomposition({
        matrix: [
          [4, 13],
          [12, 37],
        ],
      }),
    ).toThrow();
  });

  it("rejects non-square, asymmetric, and indefinite matrices through execution", () => {
    expect(
      runCholeskyDecomposition({ matrix: [[1, 2, 3], [4, 5, 6]] }),
    ).toMatchObject({
      error: { issues: [{ code: "not_square" }] },
      ok: false,
    });
    expect(
      runCholeskyDecomposition({
        matrix: [
          [1, 2],
          [3, 4],
        ],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "not_symmetric" }] },
      ok: false,
    });
    expect(
      runCholeskyDecomposition({
        matrix: [
          [1, 2],
          [2, 1],
        ],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "not_positive_definite" }] },
      ok: false,
    });
    expect(runCholeskyDecomposition({ matrix: [] }).ok).toBe(false);
  });
});
