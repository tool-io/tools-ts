import { describe, expect, it } from "vitest";
import {
  calculateIonizationFraction,
  ionizationFractionExample,
  runIonizationFraction,
} from "./tool.js";

describe("ionization fraction calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIonizationFraction(ionizationFractionExample.input)).toEqual({
      ok: true,
      output: ionizationFractionExample.output,
    });
  });

  it("approaches unity as temperature rises", () => {
    const cold = calculateIonizationFraction({
      dopingPerCm3: 1e16,
      ionizationEnergyEv: 0.045,
      temperatureK: 77,
    }).ionizedFraction;
    const warm = calculateIonizationFraction({
      dopingPerCm3: 1e16,
      ionizationEnergyEv: 0.045,
      temperatureK: 300,
    }).ionizedFraction;
    expect(warm).toBeGreaterThan(cold);
    expect(warm).toBeGreaterThan(0.9);
  });

  it("raises the fraction only slightly above room temperature", () => {
    // Nc(T) growth partly offsets the exp(Ei/kT) drop, so the gain is small.
    const warm = calculateIonizationFraction({
      dopingPerCm3: 1e16,
      ionizationEnergyEv: 0.045,
      temperatureK: 300,
    }).ionizedFraction;
    const hot = calculateIonizationFraction({
      dopingPerCm3: 1e16,
      ionizationEnergyEv: 0.045,
      temperatureK: 450,
    }).ionizedFraction;
    expect(hot).toBeGreaterThan(warm);
    expect(hot - warm).toBeLessThan(0.01);
  });

  it("rejects invalid inputs through execution", () => {
    for (const bad of [
      { dopingPerCm3: 0, ionizationEnergyEv: 0.045, temperatureK: 300 },
      { dopingPerCm3: 1e16, ionizationEnergyEv: 0.045, temperatureK: 0 },
    ])
      expect(runIonizationFraction(bad).ok).toBe(false);
  });
});
