import { describe, expect, it } from "vitest";
import {
  calculateDepletionCapacitanceAbrupt,
  depletionCapacitanceAbruptExample,
  runDepletionCapacitanceAbrupt,
} from "./tool.js";

describe("depletion capacitance abrupt junction", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDepletionCapacitanceAbrupt(depletionCapacitanceAbruptExample.input),
    ).toEqual({
      ok: true,
      output: depletionCapacitanceAbruptExample.output,
    });
  });

  it("falls off as one over the square root of total voltage", () => {
    const zero = calculateDepletionCapacitanceAbrupt({
      areaCm2: 1e-4,
      builtInVoltageV: 0.7,
      dopingPerCm3: 1e16,
    }).capacitancePf;
    const biased = calculateDepletionCapacitanceAbrupt({
      areaCm2: 1e-4,
      builtInVoltageV: 0.7,
      dopingPerCm3: 1e16,
      reverseBiasV: 3,
    }).capacitancePf;
    expect(biased).toBeCloseTo(zero / Math.sqrt(3.7 / 0.7), 9);
  });

  it("rejects non-positive area and doping through execution", () => {
    for (const bad of [
      { areaCm2: 0, builtInVoltageV: 0.7, dopingPerCm3: 1e16 },
      { areaCm2: 1e-4, builtInVoltageV: 0.7, dopingPerCm3: -1 },
    ])
      expect(runDepletionCapacitanceAbrupt(bad).ok).toBe(false);
  });

  it("direct and C ∝ 1/W", () => {
    const c0 = calculateDepletionCapacitanceAbrupt({
      areaCm2: 1e-4,
      dopingPerCm3: 1e16,
      builtInVoltageV: 0.7,
      reverseBiasV: 0,
    }).capacitancePf;
    const c1 = calculateDepletionCapacitanceAbrupt({
      areaCm2: 1e-4,
      dopingPerCm3: 1e16,
      builtInVoltageV: 0.7,
      reverseBiasV: 2.1,
    }).capacitancePf;
    expect(c1).toBeLessThan(c0);
    expect(() =>
      calculateDepletionCapacitanceAbrupt({
        areaCm2: -1,
        dopingPerCm3: 1e16,
      }),
    ).toThrow();
  });

  it("rejects zero total junction voltage", () => {
    const result = runDepletionCapacitanceAbrupt({
      areaCm2: 1e-4,
      builtInVoltageV: 0,
      dopingPerCm3: 1e16,
      reverseBiasV: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "invalid_voltage",
        field: "reverseBiasV",
      });
  });
});
