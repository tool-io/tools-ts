import { describe, expect, it } from "vitest";
import {
  wellheadPressureShutInExample,
  runWellheadPressureShutIn,
} from "./tool.js";

describe("geology/wellhead-pressure-shut-in", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWellheadPressureShutIn(wellheadPressureShutInExample.input),
    ).toEqual({
      ok: true,
      output: wellheadPressureShutInExample.output,
    });
  });

  it("lowers the shut-in wellhead pressure with a denser fluid", () => {
    const light = runWellheadPressureShutIn({
      bottomholePressureMegapascals: 34.5,
      fluidDensityKilogramsPerCubicMetre: 1000,
      trueVerticalDepthMetres: 2800,
    });
    const heavy = runWellheadPressureShutIn({
      bottomholePressureMegapascals: 34.5,
      fluidDensityKilogramsPerCubicMetre: 1200,
      trueVerticalDepthMetres: 2800,
    });
    expect(light.ok && heavy.ok).toBe(true);
    if (light.ok && heavy.ok)
      expect(
        heavy.output.shutInWellheadPressureMegapascals as number,
      ).toBeLessThan(light.output.shutInWellheadPressureMegapascals as number);
  });

  it("rejects a column heavier than the bottom-hole pressure", () => {
    expect(
      runWellheadPressureShutIn({
        bottomholePressureMegapascals: 5,
        fluidDensityKilogramsPerCubicMetre: 1100,
        trueVerticalDepthMetres: 2800,
      }).ok,
    ).toBe(false);
    expect(
      runWellheadPressureShutIn({
        bottomholePressureMegapascals: 34.5,
        fluidDensityKilogramsPerCubicMetre: 0,
        trueVerticalDepthMetres: 2800,
      }).ok,
    ).toBe(false);
  });
});
