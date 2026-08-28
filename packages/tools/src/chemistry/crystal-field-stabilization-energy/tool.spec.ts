import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateCrystalFieldStabilizationEnergy,
  CrystalFieldStabilizationEnergyTool,
  crystalFieldStabilizationEnergyExample,
  runCrystalFieldStabilizationEnergy,
} from "./tool.js";

describe("Crystal Field Stabilization Energy Calculator", () => {
  it("reproduces the canonical example exactly", () => {
    expect(
      runCrystalFieldStabilizationEnergy(
        crystalFieldStabilizationEnergyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: crystalFieldStabilizationEnergyExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(CrystalFieldStabilizationEnergyTool)).toEqual(
      [],
    );
  });

  it("is zero for the spherical d0 and high-spin d5 counts", () => {
    expect(
      calculateCrystalFieldStabilizationEnergy({
        egElectrons: 0,
        t2gElectrons: 0,
      }).cfseDeltaOUnits,
    ).toBe(0);
    expect(
      calculateCrystalFieldStabilizationEnergy({
        egElectrons: 2,
        t2gElectrons: 3,
      }).cfseDeltaOUnits,
    ).toBeCloseTo(0, 12);
  });

  it("rejects impossible orbital occupancies", () => {
    expect(
      runCrystalFieldStabilizationEnergy({
        ...crystalFieldStabilizationEnergyExample.input,
        t2gElectrons: 7,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(() =>
      calculateCrystalFieldStabilizationEnergy({
        ...crystalFieldStabilizationEnergyExample.input,
        egElectrons: 5,
      }),
    ).toThrow();
    expect(runCrystalFieldStabilizationEnergy(null).ok).toBe(false);
  });
});
