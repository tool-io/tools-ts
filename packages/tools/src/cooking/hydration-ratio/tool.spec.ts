import { describe, expect, it } from "vitest";
import { runHydrationRatio } from "./tool.js";

describe("Hydration Ratio Calculator", () => {
  it("calculates a valid result", () => {
    expect(runHydrationRatio({ flourGrams: 500, waterGrams: 350 })).toEqual({
      ok: true,
      output: { hydrationPercent: 70 },
    });
  });

  it("rejects invalid input", () =>
    expect(runHydrationRatio(null).ok).toBe(false));
});
