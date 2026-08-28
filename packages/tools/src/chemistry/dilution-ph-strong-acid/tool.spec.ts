import { describe, expect, it } from "vitest";
import { runDilutionPhStrongAcid } from "./tool.js";

describe("Dilution pH Strong Acid Calculator", () => {
  it("calculates a valid result", () => {
    const result = runDilutionPhStrongAcid({
      finalVolumeL: 2,
      initialConcentrationMolL: 0.1,
      initialVolumeL: 0.1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ph).toBeCloseTo(2.301, 2);
  });

  it("rejects invalid input", () =>
    expect(runDilutionPhStrongAcid(null).ok).toBe(false));
});
