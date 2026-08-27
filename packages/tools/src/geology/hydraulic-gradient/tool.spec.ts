import { describe, expect, it } from "vitest";
import { hydraulicGradientExample, runHydraulicGradient } from "./tool.js";

describe("hydraulic-gradient", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHydraulicGradient(hydraulicGradientExample.input)).toEqual({
      ok: true,
      output: hydraulicGradientExample.output,
    });
  });

  it("returns unit gradient for equal head loss and length", () => {
    const result = runHydraulicGradient({
      headDifferenceM: 7.5,
      flowPathLengthM: 7.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.hydraulicGradient as number).toBe(1);
  });

  it("rejects non-positive flow path lengths", () => {
    expect(
      runHydraulicGradient({ headDifferenceM: 1, flowPathLengthM: 0 }).ok,
    ).toBe(false);
  });
});
