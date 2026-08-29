import { describe, expect, it } from "vitest";
import { acPowerTriangleExample, runAcPowerTriangle } from "./tool.js";

describe("AC power triangle calculator", () => {
  it("reproduces the 3-4-5 power triangle", () => {
    expect(runAcPowerTriangle(acPowerTriangleExample.input)).toEqual({
      ok: true,
      output: acPowerTriangleExample.output,
    });
  });

  it("uses negative reactive power for a leading load", () => {
    const result = runAcPowerTriangle({
      powerFactor: 0.8,
      reactiveMode: "leading",
      realPowerWatts: 800,
    });
    expect(result.ok && result.output).toMatchObject({
      phaseAngleDegrees: -36.86989764584401,
      reactivePowerVoltAmperesReactive: -600,
    });
  });

  it("rejects a zero power factor", () => {
    const result = runAcPowerTriangle({
      powerFactor: 0,
      reactiveMode: "lagging",
      realPowerWatts: 800,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]).toMatchObject({
        code: "power_factor_out_of_range",
        field: "powerFactor",
      });
  });
});
