import { describe, expect, it } from "vitest";
import { runTrace } from "./tool.js";
describe("Matrix Trace Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runTrace({
        matrix: [
          [1, 2],
          [3, 4],
        ],
      }),
    ).toEqual({ ok: true, output: { trace: 5 } });
  });
  it("rejects invalid input", () => expect(runTrace(null).ok).toBe(false));
});
