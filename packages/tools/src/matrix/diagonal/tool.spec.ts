import { describe, expect, it } from "vitest";
import { runDiagonal } from "./tool.js";
describe("Matrix Diagonal Extractor", () => {
  it("calculates a valid result", () => {
    expect(
      runDiagonal({
        matrix: [
          [1, 2, 3],
          [4, 5, 6],
        ],
      }),
    ).toEqual({ ok: true, output: { diagonal: [1, 5] } });
  });
  it("rejects invalid input", () => expect(runDiagonal(null).ok).toBe(false));
});
