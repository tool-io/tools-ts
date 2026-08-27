import { describe, expect, it } from "vitest";
import {
  calculateInductorEnergy,
  inductorEnergyExample,
  runInductorEnergy,
} from "./tool.js";

describe("inductor energy calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runInductorEnergy(inductorEnergyExample.input)).toEqual({
      ok: true,
      output: inductorEnergyExample.output,
    });
  });

  it("quadruples energy when current doubles", () => {
    const base = calculateInductorEnergy({
      currentA: 2,
      inductanceH: 0.01,
    }).energyJoules;
    const doubled = calculateInductorEnergy({
      currentA: 4,
      inductanceH: 0.01,
    }).energyJoules;
    expect(doubled).toBeCloseTo(base * 4, 15);
    expect(
      calculateInductorEnergy({ currentA: 0, inductanceH: 0.5 }).energyJoules,
    ).toBe(0);
  });

  it("rejects negative inputs through execution", () => {
    for (const bad of [
      { currentA: -2, inductanceH: 0.01 },
      { currentA: 2, inductanceH: -0.01 },
    ])
      expect(runInductorEnergy(bad).ok).toBe(false);
  });
});
