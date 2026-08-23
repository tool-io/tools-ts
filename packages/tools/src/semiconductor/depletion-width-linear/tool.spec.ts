import { describe, expect, it } from "vitest";
import {
  depletionWidthLinearExample,
  runDepletionWidthLinear,
  calculateDepletionWidthLinear,
} from "./tool.js";

describe("depletion width linearly graded junction", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDepletionWidthLinear(depletionWidthLinearExample.input)).toEqual({
      ok: true,
      output: depletionWidthLinearExample.output,
    });
  });

  it("widens with reverse bias", () => {
    const zero = runDepletionWidthLinear({
      builtInVoltageV: 0.7,
      gradeConstantPerCm4: 1e20,
      reverseBiasV: 0,
    });
    const biased = runDepletionWidthLinear({
      builtInVoltageV: 0.7,
      gradeConstantPerCm4: 1e20,
      reverseBiasV: 5,
    });
    if (!zero.ok || !biased.ok) throw new Error("expected success");
    const zeroWidth = zero.output.widthUm;
    const biasedWidth = biased.output.widthUm;
    expect(biasedWidth).toBeGreaterThan(zeroWidth);
  });

  it("rejects non-positive grading constants through execution", () => {
    expect(
      runDepletionWidthLinear({ builtInVoltageV: 0.7, gradeConstantPerCm4: 0 })
        .ok,
    ).toBe(false);
  });

  it("direct and width ∝ cbrt(totalVoltage)", () => {
    const w1 = calculateDepletionWidthLinear({
      builtInVoltageV: 0.7,
      gradeConstantPerCm4: 1e20,
      reverseBiasV: 0,
    }).widthUm;
    const w2 = calculateDepletionWidthLinear({
      builtInVoltageV: 0.7,
      gradeConstantPerCm4: 1e20,
      reverseBiasV: 7 * 0.7,
    }).widthUm;
    // total 0.7 -> 5.6 (8x), cbrt 8 =2, so 2x
    expect(w2).toBeCloseTo(w1 * 2, 10);
    expect(() =>
      calculateDepletionWidthLinear({
        builtInVoltageV: 0.7,
        gradeConstantPerCm4: -1,
      }),
    ).toThrow();
  });
});
