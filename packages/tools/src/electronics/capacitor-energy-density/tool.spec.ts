import { describe, expect, it } from "vitest";
import {
  calculateCapacitorEnergyDensity,
  capacitorEnergyDensityExample,
  runCapacitorEnergyDensity,
} from "./tool.js";

describe("capacitor energy density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCapacitorEnergyDensity(capacitorEnergyDensityExample.input),
    ).toEqual({ ok: true, output: capacitorEnergyDensityExample.output });
  });

  it("quadruples the density when charge voltage doubles", () => {
    const base = calculateCapacitorEnergyDensity({
      capacitanceFarads: 1e-4,
      voltageVolts: 5,
      volumeMl: 3,
    }).energyDensityMjPerCm3;
    expect(
      calculateCapacitorEnergyDensity({
        capacitanceFarads: 1e-4,
        voltageVolts: 10,
        volumeMl: 3,
      }).energyDensityMjPerCm3,
    ).toBeCloseTo(base * 4, 15);
  });

  it("treats one milliliter as one cubic centimeter", () => {
    expect(
      calculateCapacitorEnergyDensity({
        capacitanceFarads: 1e-4,
        voltageVolts: 12,
        volumeMl: 4,
      }).energyDensityMjPerCm3,
    ).toBeCloseTo(1.8, 15);
  });

  it("matches half C v squared over volume times one thousand", () => {
    const capacitanceFarads = 0.0022;
    const voltageVolts = 16;
    const volumeMl = 7;
    expect(
      calculateCapacitorEnergyDensity({
        capacitanceFarads,
        voltageVolts,
        volumeMl,
      }).energyDensityMjPerCm3,
    ).toBeCloseTo(
      ((0.5 * capacitanceFarads * voltageVolts ** 2) / volumeMl) * 1000,
      15,
    );
  });

  it("rejects non-positive inputs through execution", () => {
    expect(
      runCapacitorEnergyDensity({
        capacitanceFarads: 0,
        voltageVolts: 5,
        volumeMl: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_capacitance", field: "capacitanceFarads" }],
      },
      ok: false,
    });
    expect(
      runCapacitorEnergyDensity({
        capacitanceFarads: 1e-3,
        voltageVolts: -5,
        volumeMl: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_voltage", field: "voltageVolts" }] },
      ok: false,
    });
    expect(
      runCapacitorEnergyDensity({
        capacitanceFarads: 1e-3,
        voltageVolts: 5,
        volumeMl: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_volume", field: "volumeMl" }] },
      ok: false,
    });
  });

  it("keeps densities positive across a supercap sweep", () => {
    for (const voltageVolts of [2.5, 5, 12]) {
      expect(
        calculateCapacitorEnergyDensity({
          capacitanceFarads: 1,
          voltageVolts,
          volumeMl: 50,
        }).energyDensityMjPerCm3,
      ).toBeGreaterThan(0);
    }
  });
});
