import { describe, expect, it } from "vitest";
import {
  penAngleThinningCalculatorExample,
  runPenAngleThinningCalculator,
} from "./tool.js";

describe("pen-angle-thinning-calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPenAngleThinningCalculator(penAngleThinningCalculatorExample.input),
    ).toEqual({
      ok: true,
      output: penAngleThinningCalculatorExample.output,
    });
  });

  it("gives full-width stems at a flat pen angle", () => {
    const result = runPenAngleThinningCalculator({
      nibWidthMm: 2.5,
      penAngleDegrees: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.verticalStemWidthMm).toBeCloseTo(
      2.499619237890978,
      12,
    );
    expect(result.output.thinningRatio).toBeGreaterThan(50);
  });

  it("rejects pen angles outside the open interval", () => {
    expect(
      runPenAngleThinningCalculator({ nibWidthMm: 2, penAngleDegrees: 90 }).ok,
    ).toBe(false);
  });

  it("accepts fractional angles inside the documented open interval", () => {
    const result = runPenAngleThinningCalculator({
      nibWidthMm: 2,
      penAngleDegrees: 0.5,
    });
    expect(result.ok).toBe(true);
  });
});
