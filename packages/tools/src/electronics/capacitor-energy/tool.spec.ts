import { describe, expect, it } from "vitest";
import {
  capacitorEnergyExample,
  calculateCapacitorEnergy,
  runCapacitorEnergy,
} from "./tool.js";

describe("capacitor energy calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCapacitorEnergy(capacitorEnergyExample.input)).toEqual({
      ok: true,
      output: capacitorEnergyExample.output,
    });
  });

  it("quadruples energy when voltage doubles", () => {
    const base = calculateCapacitorEnergy({
      capacitanceFarads: 1e-4,
      voltageV: 5,
    }).energyJoules;
    const doubled = calculateCapacitorEnergy({
      capacitanceFarads: 1e-4,
      voltageV: 10,
    }).energyJoules;
    expect(doubled).toBeCloseTo(base * 4, 15);
    expect(
      calculateCapacitorEnergy({ capacitanceFarads: 0.01, voltageV: 0 })
        .energyJoules,
    ).toBe(0);
  });

  it("rejects negative inputs through execution", () => {
    for (const bad of [
      { capacitanceFarads: -1e-4, voltageV: 5 },
      { capacitanceFarads: 1e-4, voltageV: -5 },
    ])
      expect(runCapacitorEnergy(bad).ok).toBe(false);
  });
});
