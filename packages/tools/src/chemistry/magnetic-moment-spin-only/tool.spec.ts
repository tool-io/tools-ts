import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateMagneticMomentSpinOnly,
  MagneticMomentSpinOnlyTool,
  magneticMomentSpinOnlyExample,
  runMagneticMomentSpinOnly,
} from "./tool.js";

describe("Spin-Only Magnetic Moment Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(
      runMagneticMomentSpinOnly(magneticMomentSpinOnlyExample.input),
    ).toEqual({
      ok: true,
      output: magneticMomentSpinOnlyExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(MagneticMomentSpinOnlyTool)).toEqual([]);
  });

  it("vanishes for a closed shell and matches sqrt(n(n+2)) at one electron", () => {
    expect(
      calculateMagneticMomentSpinOnly({ unpairedElectrons: 0 })
        .magneticMomentBohrMagneton,
    ).toBe(0);
    expect(
      calculateMagneticMomentSpinOnly({ unpairedElectrons: 1 })
        .magneticMomentBohrMagneton,
    ).toBeCloseTo(Math.sqrt(3), 12);
  });

  it("rejects invalid input", () => {
    expect(runMagneticMomentSpinOnly({ unpairedElectrons: -1 }).ok).toBe(false);
    expect(runMagneticMomentSpinOnly({ unpairedElectrons: 11 }).ok).toBe(false);
    expect(runMagneticMomentSpinOnly(null).ok).toBe(false);
  });
});
