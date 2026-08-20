import { describe, expect, it } from "vitest";
import { depletionWidthLinearExample, runDepletionWidthLinear } from "./tool.js";

describe("depletion width linearly graded junction", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDepletionWidthLinear(depletionWidthLinearExample.input)).toEqual({
      ok: true,
      output: depletionWidthLinearExample.output,
    });
  });

  it("widens with reverse bias", () => {
    const zero = runDepletionWidthLinear({ builtInVoltageV: 0.7, gradeConstantPerCm3: 1e20, reverseBiasV: 0 });
    const biased = runDepletionWidthLinear({ builtInVoltageV: 0.7, gradeConstantPerCm3: 1e20, reverseBiasV: 5 });
    if (!zero.ok || !biased.ok) throw new Error("expected success");
    const zeroWidth = (zero.output as { widthUm: number }).widthUm;
    const biasedWidth = (biased.output as { widthUm: number }).widthUm;
    expect(biasedWidth).toBeGreaterThan(zeroWidth);
  });

  it("rejects non-positive grading constants through execution", () => {
    expect(runDepletionWidthLinear({ builtInVoltageV: 0.7, gradeConstantPerCm3: 0 }).ok).toBe(false);
  });
});
