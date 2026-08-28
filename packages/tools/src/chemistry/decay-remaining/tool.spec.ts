import { describe, expect, it } from "vitest";
import { runDecayRemaining } from "./tool.js";

describe("Decay Remaining Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runDecayRemaining({
        elapsed: 10,
        halfLife: 5,
        initialAmount: 80,
      }),
    ).toEqual({ ok: true, output: { fractionRemaining: 0.25, remaining: 20 } });
  });

  it("rejects invalid input", () =>
    expect(runDecayRemaining(null).ok).toBe(false));
});
