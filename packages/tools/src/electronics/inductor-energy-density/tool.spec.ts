import { describe, expect, it } from "vitest";
import {
  calculateInductorEnergyDensity,
  inductorEnergyDensityExample,
  runInductorEnergyDensity,
} from "./tool.js";

describe("inductor energy density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runInductorEnergyDensity(inductorEnergyDensityExample.input),
    ).toEqual({ ok: true, output: inductorEnergyDensityExample.output });
  });

  it("quadruples the density when current doubles", () => {
    const base = calculateInductorEnergyDensity({
      coreVolumeCm3: 2,
      currentAmps: 1.5,
      lHenry: 1e-3,
    }).energyDensityMjPerCm3;
    expect(
      calculateInductorEnergyDensity({
        coreVolumeCm3: 2,
        currentAmps: 3,
        lHenry: 1e-3,
      }).energyDensityMjPerCm3,
    ).toBeCloseTo(base * 4, 15);
  });

  it("halves the density when volume doubles", () => {
    const base = calculateInductorEnergyDensity({
      coreVolumeCm3: 2,
      currentAmps: 2,
      lHenry: 1e-4,
    }).energyDensityMjPerCm3;
    const doubled = calculateInductorEnergyDensity({
      coreVolumeCm3: 4,
      currentAmps: 2,
      lHenry: 1e-4,
    }).energyDensityMjPerCm3;
    expect(doubled).toBeCloseTo(base / 2, 15);
    expect(doubled).toBeCloseTo(0.05, 12);
  });

  it("matches half L i squared over volume times one thousand", () => {
    const lHenry = 0.0047;
    const currentAmps = 1.8;
    const coreVolumeCm3 = 5;
    expect(
      calculateInductorEnergyDensity({
        coreVolumeCm3,
        currentAmps,
        lHenry,
      }).energyDensityMjPerCm3,
    ).toBeCloseTo(
      ((0.5 * lHenry * currentAmps ** 2) / coreVolumeCm3) * 1000,
      15,
    );
  });

  it("rejects non-positive inputs through execution", () => {
    for (const [bad, field, code] of [
      [
        { coreVolumeCm3: 1, currentAmps: 2, lHenry: 0 },
        "lHenry",
        "invalid_inductance",
      ],
      [
        { coreVolumeCm3: 1, currentAmps: -2, lHenry: 1e-3 },
        "currentAmps",
        "invalid_current",
      ],
      [
        { coreVolumeCm3: 0, currentAmps: 2, lHenry: 1e-3 },
        "coreVolumeCm3",
        "invalid_volume",
      ],
    ]) {
      expect(runInductorEnergyDensity(bad)).toMatchObject({
        error: { issues: [{ code, field }] },
        ok: false,
      });
    }
  });

  it("stays positive across a sweep of realistic cores", () => {
    for (const lHenry of [1e-6, 1e-4, 1e-2]) {
      expect(
        calculateInductorEnergyDensity({
          coreVolumeCm3: 3,
          currentAmps: 0.9,
          lHenry,
        }).energyDensityMjPerCm3,
      ).toBeGreaterThan(0);
    }
  });
});
