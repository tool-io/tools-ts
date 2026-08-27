import { describe, expect, it } from "vitest";
import {
  calculateMagneticSusceptibilityLookup,
  magneticSusceptibilityLookupExample,
  runMagneticSusceptibilityLookup,
} from "./tool.js";

describe("geology/magnetic-susceptibility-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMagneticSusceptibilityLookup(
        magneticSusceptibilityLookupExample.input,
      ),
    ).toEqual({ ok: true, output: magneticSusceptibilityLookupExample.output });
  });

  it("converts SI susceptibility to CGS by dividing by four pi", () => {
    const result = calculateMagneticSusceptibilityLookup({
      inducedMagnetizationAPerM: 1,
      fieldStrengthAPerM: 1000,
    });
    expect(result.volumeSusceptibilitySi).toBe(0.001);
    expect(result.volumeSusceptibilityCgsEmu).toBe(0.001 / (4 * Math.PI));
  });

  it("rejects non-positive field strength and negative magnetization", () => {
    expect(
      runMagneticSusceptibilityLookup({
        inducedMagnetizationAPerM: 0.002,
        fieldStrengthAPerM: 0,
      }).ok,
    ).toBe(false);
    expect(
      runMagneticSusceptibilityLookup({
        inducedMagnetizationAPerM: -0.001,
        fieldStrengthAPerM: 40,
      }).ok,
    ).toBe(false);
  });
});
