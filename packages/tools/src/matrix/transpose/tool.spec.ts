import { describe, expect, it } from "vitest";
import { runTranspose } from "./tool.js";
describe("Matrix Transpose Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runTranspose({
        matrix: [
          [1, 2, 3],
          [4, 5, 6],
        ],
      }),
    ).toEqual({
      ok: true,
      output: {
        matrix: [
          [1, 4],
          [2, 5],
          [3, 6],
        ],
      },
    });
  });
  it("rejects invalid input", () => expect(runTranspose(null).ok).toBe(false));
});
