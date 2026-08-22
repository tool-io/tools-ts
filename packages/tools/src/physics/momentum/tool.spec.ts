import { describe, expect, it } from "vitest";
import { runMomentum } from "./tool.js";

describe("Momentum Calculator", () => {
  it("calculates a valid result", () => {
    expect(runMomentum({ massKg: 5, velocityMs: 3 })).toEqual({
      ok: true,
      output: { momentumKgMs: 15 },
    });
  });

  it("keeps negative velocity for opposite direction", () => {
    expect(runMomentum({ massKg: 2, velocityMs: -4 })).toEqual({
      ok: true,
      output: { momentumKgMs: -8 },
    });
  });

  it("rejects invalid input", () => expect(runMomentum(null).ok).toBe(false));
});
