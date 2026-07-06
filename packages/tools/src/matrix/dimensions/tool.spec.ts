import { describe, expect, it } from "vitest";
import { runDimensions } from "./tool.js";
describe("Matrix Dimensions Tool", () => {
  it("calculates a valid result", () => {
    expect(
      runDimensions({
        matrix: [
          [1, 2],
          [3, 4],
        ],
      }),
    ).toEqual({ ok: true, output: { rows: 2, columns: 2 } });
  });
  it("rejects invalid input", () => expect(runDimensions(null).ok).toBe(false));
});
