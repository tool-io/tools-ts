import { describe, expect, it } from "vitest";
import { calculateDepletionCapacitanceAbrupt, depletionCapacitanceAbruptExample, runDepletionCapacitanceAbrupt } from "./tool.js";

describe("depletion capacitance abrupt junction", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDepletionCapacitanceAbrupt(depletionCapacitanceAbruptExample.input)).toEqual({
      ok: true,
      output: depletionCapacitanceAbruptExample.output,
    });
  });

  it("falls off as one over the square root of total voltage", () => {
    const zero = calculateDepletionCapacitanceAbrupt({ areaCm2: 1e-4, builtInVoltageV: 0.7, dopingPerCm3: 1e16 }).capacitancePf;
    const biased = calculateDepletionCapacitanceAbrupt({ areaCm2: 1e-4, builtInVoltageV: 0.7, dopingPerCm3: 1e16, reverseBiasV: 3 }).capacitancePf;
    expect(biased).toBeCloseTo(zero / Math.sqrt(3.7 / 0.7), 9);
  });

  it("rejects non-positive area and doping through execution", () => {
    for (const bad of [{ areaCm2: 0, builtInVoltageV: 0.7, dopingPerCm3: 1e16 }, { areaCm2: 1e-4, builtInVoltageV: 0.7, dopingPerCm3: -1 }])
      expect(runDepletionCapacitanceAbrupt(bad).ok).toBe(false);
  });
});
