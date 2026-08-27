import { describe, expect, it } from "vitest";
import { lavaViscosityExample, runLavaViscosity } from "./tool.js";

describe("lava-viscosity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLavaViscosity(lavaViscosityExample.input)).toEqual({
      ok: true,
      output: lavaViscosityExample.output,
    });
  });

  it("returns the pre-exponential factor at infinite temperature limit", () => {
    const result = runLavaViscosity({
      activationEnergyJPerMol: 1000,
      preExponentialPaSecond: 5,
      temperatureKelvin: 1e12,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.viscosityPascalSeconds as number).toBeCloseTo(5, 6);
  });
  it("rejects non-positive temperatures", () => {
    expect(
      runLavaViscosity({
        activationEnergyJPerMol: 50000,
        preExponentialPaSecond: 10,
        temperatureKelvin: 0,
      }).ok,
    ).toBe(false);
  });
});
