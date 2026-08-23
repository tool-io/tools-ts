import { describe, expect, it } from "vitest";
import {
  calculateDepletionCapacitanceLinear,
  depletionCapacitanceLinearExample,
  runDepletionCapacitanceLinear,
} from "./tool.js";

describe("depletion capacitance linearly graded junction", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDepletionCapacitanceLinear(depletionCapacitanceLinearExample.input),
    ).toEqual({
      ok: true,
      output: depletionCapacitanceLinearExample.output,
    });
  });

  it("falls off as one over the cube root of total voltage", () => {
    const zero = calculateDepletionCapacitanceLinear({
      areaCm2: 1e-4,
      builtInVoltageV: 0.7,
      gradeConstantPerCm4: 1e20,
    }).capacitancePf;
    const biased = calculateDepletionCapacitanceLinear({
      areaCm2: 1e-4,
      builtInVoltageV: 0.7,
      gradeConstantPerCm4: 1e20,
      reverseBiasV: 7,
    }).capacitancePf;
    expect(biased).toBeCloseTo(zero / Math.cbrt(7.7 / 0.7), 9);
  });

  it("rejects non-positive grading through execution", () => {
    expect(
      runDepletionCapacitanceLinear({
        areaCm2: 1e-4,
        builtInVoltageV: 0.7,
        gradeConstantPerCm4: -1,
      }).ok,
    ).toBe(false);
  });

  it("direct and C decreases with bias", () => {
    const c0 = calculateDepletionCapacitanceLinear({
      areaCm2: 1e-4,
      gradeConstantPerCm4: 1e20,
      builtInVoltageV: 0.7,
      reverseBiasV: 0,
    }).capacitancePf;
    const c1 = calculateDepletionCapacitanceLinear({
      areaCm2: 1e-4,
      gradeConstantPerCm4: 1e20,
      builtInVoltageV: 0.7,
      reverseBiasV: 5,
    }).capacitancePf;
    expect(c1).toBeLessThan(c0);
    expect(() =>
      calculateDepletionCapacitanceLinear({
        areaCm2: 1e-4,
        gradeConstantPerCm4: 0,
      }),
    ).toThrow();
  });

  it("rejects zero total junction voltage", () => {
    const result = runDepletionCapacitanceLinear({
      areaCm2: 1e-4,
      builtInVoltageV: 0,
      gradeConstantPerCm4: 1e20,
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
