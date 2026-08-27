import { describe, expect, it } from "vitest";
import { brineDensityExample, runBrineDensity } from "./tool.js";

describe("brine-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBrineDensity(brineDensityExample.input)).toEqual({
      ok: true,
      output: brineDensityExample.output,
    });
  });

  it("degenerates to fresh water without salt", () => {
    const result = runBrineDensity({
      waterMassKg: 2,
      saltMassKg: 0,
      volumeCubicMetres: 0.002,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.brineDensityKgPerCubicMetre).toBe(1000);
    expect(result.output.salinityPpm).toBe(0);
  });

  it("rejects non-positive volumes", () => {
    expect(
      runBrineDensity({
        waterMassKg: 1,
        saltMassKg: 0.035,
        volumeCubicMetres: 0,
      }).ok,
    ).toBe(false);
  });
});
