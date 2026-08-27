import { describe, expect, it } from "vitest";
import {
  hydrostaticPressureGradientBrineExample,
  runHydrostaticPressureGradientBrine,
} from "./tool.js";

describe("hydrostatic-pressure-gradient-brine", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHydrostaticPressureGradientBrine(
        hydrostaticPressureGradientBrineExample.input,
      ),
    ).toEqual({
      ok: true,
      output: hydrostaticPressureGradientBrineExample.output,
    });
  });

  it("yields the fresh-water gradient for pure water", () => {
    const result = runHydrostaticPressureGradientBrine({
      brineDensityKgPerCubicMetre: 1000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.gradientPaPerMetre).toBeCloseTo(9806.65, 6);
    expect(result.output.gradientKilopascalsPerMetre).toBeCloseTo(9.80665, 6);
  });

  it("rejects non-positive densities", () => {
    expect(
      runHydrostaticPressureGradientBrine({ brineDensityKgPerCubicMetre: 0 })
        .ok,
    ).toBe(false);
  });
});
