import { describe, expect, it } from "vitest";
import {
  calculateIngaasBandgap,
  ingaasBandgapExample,
  runIngaasBandgap,
} from "./tool.js";

describe("InGaAs Bandgap Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIngaasBandgap(ingaasBandgapExample.input)).toEqual({
      ok: true,
      output: ingaasBandgapExample.output,
    });
  });

  it("returns the InAs and GaAs endpoint band gaps", () => {
    expect(calculateIngaasBandgap({ galliumFractionX: 0 })).toEqual({
      bandgapEv: 0.354,
    });
    expect(calculateIngaasBandgap({ galliumFractionX: 1 })).toEqual({
      bandgapEv: 1.424,
    });
  });

  it("includes the alloy-bowing reduction at intermediate composition", () => {
    const result = calculateIngaasBandgap({ galliumFractionX: 0.5 });
    expect(result.bandgapEv).toBe(0.76975);
    expect(result.bandgapEv).toBeLessThan((0.354 + 1.424) / 2);
  });

  it("rejects gallium fractions outside zero through one", () => {
    expect(runIngaasBandgap({ galliumFractionX: -0.01 }).ok).toBe(false);
    expect(runIngaasBandgap({ galliumFractionX: 1.01 }).ok).toBe(false);
  });
});
