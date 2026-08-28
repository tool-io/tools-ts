import { describe, expect, it } from "vitest";
import { runPercentCarbonCombustion } from "./tool.js";

describe("Percent Carbon From Combustion Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runPercentCarbonCombustion({ carbonMassG: 6, sampleMassG: 10 }),
    ).toEqual({ ok: true, output: { percentCarbon: 60 } });
  });

  it("rejects invalid input", () =>
    expect(runPercentCarbonCombustion(null).ok).toBe(false));
});
