import { describe, expect, it } from "vitest";
import { buoyantDensityExample, runBuoyantDensity } from "./tool.js";

describe("buoyant-density", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBuoyantDensity(buoyantDensityExample.input)).toEqual({
      ok: true,
      output: buoyantDensityExample.output,
    });
  });

  it("uses a default water density of 1000 kg/m3", () => {
    const result = runBuoyantDensity({ saturatedDensityKgPerM3: 2200 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.buoyantDensityKgPerM3 as number).toBe(1200);
  });
  it("rejects densities at or below the water density", () => {
    expect(runBuoyantDensity({ saturatedDensityKgPerM3: 900 }).ok).toBe(false);
  });
});
