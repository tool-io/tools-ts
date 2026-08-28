import { describe, expect, it } from "vitest";
import { runDaltonTotalPressure } from "./tool.js";

describe("Dalton Total Pressure Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runDaltonTotalPressure({ partialPressures: [0.21, 0.78, 0.01] }),
    ).toEqual({ ok: true, output: { totalPressure: 1 } });
  });

  it("rejects invalid input", () =>
    expect(runDaltonTotalPressure(null).ok).toBe(false));
});
