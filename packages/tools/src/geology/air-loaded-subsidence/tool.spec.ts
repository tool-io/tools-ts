import { describe, expect, it } from "vitest";
import { runAirLoadedSubsidence, airLoadedSubsidenceExample } from "./tool.js";

describe("air-loaded-subsidence", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAirLoadedSubsidence(airLoadedSubsidenceExample.input)).toEqual({
      ok: true,
      output: airLoadedSubsidenceExample.output,
    });
  });

  it("returns negative values for thin sediment under deep water", () => {
    const result = runAirLoadedSubsidence({
      decompactedThicknessM: 50,
      sedimentDensityKgPerM3: 2500,
      paleowaterDepthM: 500,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.airLoadedSubsidenceM as number).toBeLessThan(0);
  });

  it("rejects sediment densities above mantle density and negative thickness", () => {
    expect(
      runAirLoadedSubsidence({
        decompactedThicknessM: 100,
        sedimentDensityKgPerM3: 4000,
        paleowaterDepthM: 10,
      }).ok,
    ).toBe(false);
    expect(
      runAirLoadedSubsidence({
        decompactedThicknessM: -1,
        sedimentDensityKgPerM3: 2500,
        paleowaterDepthM: 10,
      }).ok,
    ).toBe(false);
  });
});
