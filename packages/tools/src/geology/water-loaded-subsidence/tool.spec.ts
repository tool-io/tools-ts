import { describe, expect, it } from "vitest";
import {
  runWaterLoadedSubsidence,
  waterLoadedSubsidenceExample,
} from "./tool.js";

describe("water-loaded-subsidence", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runWaterLoadedSubsidence(waterLoadedSubsidenceExample.input),
    ).toEqual({
      ok: true,
      output: waterLoadedSubsidenceExample.output,
    });
  });

  it("exceeds air-loaded subsidence for the same column", () => {
    const result = runWaterLoadedSubsidence({
      decompactedThicknessM: 600,
      sedimentDensityKgPerM3: 2400,
      paleowaterDepthM: 80,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.waterLoadedSubsidenceM as number).toBe(
      159.48497854077254,
    );
  });

  it("rejects invalid densities and negative thickness", () => {
    expect(
      runWaterLoadedSubsidence({
        decompactedThicknessM: 100,
        sedimentDensityKgPerM3: -5,
        paleowaterDepthM: 10,
      }).ok,
    ).toBe(false);
    expect(
      runWaterLoadedSubsidence({
        decompactedThicknessM: -1,
        sedimentDensityKgPerM3: 2500,
        paleowaterDepthM: 10,
      }).ok,
    ).toBe(false);
  });
});
