import { describe, expect, it } from "vitest";
import { runKiteArea } from "./tool.js";

describe("Kite Area Calculator", () => {
  it("calculates a valid result", () => {
    expect(runKiteArea({ diagonalP: 10, diagonalQ: 8 })).toEqual({
      ok: true,
      output: { area: 40 },
    });
  });

  it("rejects invalid input", () => expect(runKiteArea(null).ok).toBe(false));
});
