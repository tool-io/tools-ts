import { describe, expect, it } from "vitest";
import { gasDensityExample, runGasDensity } from "./tool.js";

describe("gas-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGasDensity(gasDensityExample.input)).toEqual({
      ok: true,
      output: gasDensityExample.output,
    });
  });

  it("doubles when the pressure doubles at fixed z", () => {
    const base = runGasDensity({ pressurePa: 5_000_000, temperatureK: 350 });
    const doubled = runGasDensity({
      pressurePa: 10_000_000,
      temperatureK: 350,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(
      (doubled.output.gasDensityKgPerM3 as number) /
        (base.output.gasDensityKgPerM3 as number),
    ).toBe(2);
  });
  it("rejects non-positive temperatures", () => {
    expect(runGasDensity({ pressurePa: 1e6, temperatureK: 0 }).ok).toBe(false);
  });
});
