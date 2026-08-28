import { describe, expect, it } from "vitest";
import { runElectroplatingThickness } from "./tool.js";

describe("Electroplating Thickness Calculator", () => {
  it("calculates a valid result", () => {
    const result = runElectroplatingThickness({
      areaCm2: 100,
      currentA: 0.5,
      seconds: 600,
      molarMassGMol: 63.546,
      densityGCm3: 8.96,
      valence: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.thicknessMicrometers).toBeCloseTo(1.1026, 2);
  });

  it("rejects invalid input", () =>
    expect(runElectroplatingThickness(null).ok).toBe(false));
});
