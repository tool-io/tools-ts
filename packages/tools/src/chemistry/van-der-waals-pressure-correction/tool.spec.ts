import { describe, expect, it } from "vitest";
import { runVanDerWaalsPressureCorrection } from "./tool.js";

describe("Van der Waals Pressure Correction Calculator", () => {
  it("calculates a valid result", () => {
    const result = runVanDerWaalsPressureCorrection({
      aAtmL2PerMol2: 1.39,
      bLPerMol: 0.0391,
      moles: 1,
      temperatureK: 300,
      volumeL: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.pressureAtm).toBeCloseTo(2.4576, 3);
  });

  it("rejects invalid input", () =>
    expect(runVanDerWaalsPressureCorrection(null).ok).toBe(false));
});
