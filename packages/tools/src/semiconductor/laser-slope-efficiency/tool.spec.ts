import { describe, expect, it } from "vitest";
import {
  laserSlopeEfficiencyExample,
  runLaserSlopeEfficiency,
} from "./tool.js";

describe("laser slope efficiency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLaserSlopeEfficiency(laserSlopeEfficiencyExample.input)).toEqual({
      ok: true,
      output: laserSlopeEfficiencyExample.output,
    });
  });

  it("equals the fraction times photon energy in electronvolts", () => {
    const result = runLaserSlopeEfficiency({
      differentialQuantumEfficiencyPercent: 25,
      photonEnergyEv: 1.5,
    });
    expect(result).toEqual({
      ok: true,
      output: { slopeEfficiencyWPerA: 0.375 },
    });
  });

  it("maps unity efficiency and one electronvolt to one watt per ampere", () => {
    const result = runLaserSlopeEfficiency({
      differentialQuantumEfficiencyPercent: 100,
      photonEnergyEv: 1,
    });
    expect(result).toEqual({ ok: true, output: { slopeEfficiencyWPerA: 1 } });
  });

  it("returns zero at zero differential quantum efficiency", () => {
    const result = runLaserSlopeEfficiency({
      differentialQuantumEfficiencyPercent: 0,
      photonEnergyEv: 1.5,
    });
    expect(result).toEqual({ ok: true, output: { slopeEfficiencyWPerA: 0 } });
  });

  it("scales linearly with photon energy", () => {
    const one = runLaserSlopeEfficiency({
      differentialQuantumEfficiencyPercent: 40,
      photonEnergyEv: 1,
    });
    const two = runLaserSlopeEfficiency({
      differentialQuantumEfficiencyPercent: 40,
      photonEnergyEv: 2,
    });
    if (!one.ok || !two.ok) throw new Error("expected success");
    expect(two.output.slopeEfficiencyWPerA as number).toBe(
      2 * (one.output.slopeEfficiencyWPerA as number),
    );
  });

  it("rejects efficiencies outside the inclusive percent range", () => {
    for (const percent of [-1, 100.5])
      expect(
        runLaserSlopeEfficiency({
          differentialQuantumEfficiencyPercent: percent,
          photonEnergyEv: 1.2,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects non-positive photon energy", () => {
    for (const energy of [0, -1.2])
      expect(
        runLaserSlopeEfficiency({
          differentialQuantumEfficiencyPercent: 50,
          photonEnergyEv: energy,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects missing and unknown fields", () => {
    expect(
      runLaserSlopeEfficiency({ differentialQuantumEfficiencyPercent: 50 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runLaserSlopeEfficiency({
        differentialQuantumEfficiencyPercent: 50,
        photonEnergyEv: 1.2,
        wavelengthNm: 1030,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "wavelengthNm" }] },
      ok: false,
    });
  });
});
