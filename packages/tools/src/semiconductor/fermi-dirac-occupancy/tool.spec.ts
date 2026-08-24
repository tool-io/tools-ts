import { describe, expect, it } from "vitest";
import {
  calculateFermiDiracOccupancy,
  fermiDiracOccupancyExample,
  runFermiDiracOccupancy,
} from "./tool.js";

describe("fermi-dirac occupancy calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFermiDiracOccupancy(fermiDiracOccupancyExample.input)).toEqual({
      ok: true,
      output: fermiDiracOccupancyExample.output,
    });
  });

  it("gives one half at the Fermi level", () => {
    expect(
      calculateFermiDiracOccupancy({ energyEv: 0.5, fermiLevelEv: 0.5 })
        .occupancy,
    ).toBe(0.5);
  });

  it("approaches one below and zero above the Fermi level", () => {
    const below = calculateFermiDiracOccupancy({
      energyEv: 0,
      fermiLevelEv: 0.5,
      temperatureK: 300,
    }).occupancy;
    const above = calculateFermiDiracOccupancy({
      energyEv: 1,
      fermiLevelEv: 0.5,
      temperatureK: 300,
    }).occupancy;
    expect(below).toBeGreaterThan(0.99);
    expect(above).toBeLessThan(0.01);
  });

  it("remains stable for extreme energy separations", () => {
    expect(
      calculateFermiDiracOccupancy({
        energyEv: -1e6,
        fermiLevelEv: 0,
        temperatureK: 1,
      }).occupancy,
    ).toBe(1);
    expect(
      calculateFermiDiracOccupancy({
        energyEv: 1e6,
        fermiLevelEv: 0,
        temperatureK: 1,
      }).occupancy,
    ).toBe(0);
  });
});
