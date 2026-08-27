import { describe, expect, it } from "vitest";
import {
  runBackstrippingSubsidence,
  backstrippingSubsidenceExample,
} from "./tool.js";

describe("backstripping-subsidence", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBackstrippingSubsidence(backstrippingSubsidenceExample.input),
    ).toEqual({
      ok: true,
      output: backstrippingSubsidenceExample.output,
    });
  });

  it("ignores the sea-level term when it defaults to zero", () => {
    const result = runBackstrippingSubsidence({
      decompactedThicknessM: 1000,
      sedimentDensityKgPerM3: 2500,
      paleowaterDepthM: 200,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.backstrippedSubsidenceM as number).toBe(
      156.22317596566523,
    );
  });

  it("rejects sediment densities above mantle density and negative thickness", () => {
    expect(
      runBackstrippingSubsidence({
        decompactedThicknessM: 500,
        sedimentDensityKgPerM3: 3400,
        paleowaterDepthM: 50,
      }).ok,
    ).toBe(false);
    expect(
      runBackstrippingSubsidence({
        decompactedThicknessM: -10,
        sedimentDensityKgPerM3: 2500,
        paleowaterDepthM: 50,
      }).ok,
    ).toBe(false);
  });
});
