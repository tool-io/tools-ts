import { describe, expect, it } from "vitest";
import { runDecayHalfLife } from "./tool.js";

describe("Decay Half-Life Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runDecayHalfLife({
        elapsedTime: 10,
        initialAmount: 100,
        remainingAmount: 25,
      }),
    ).toEqual({ ok: true, output: { halfLife: 5 } });
  });

  it("rejects invalid input", () =>
    expect(runDecayHalfLife(null).ok).toBe(false));
});
