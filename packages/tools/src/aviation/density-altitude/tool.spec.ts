import { describe, expect, it } from "vitest";
import {
  calculateDensityAltitude,
  densityAltitudeExample,
  runDensityAltitude,
} from "./tool.js";

describe("density altitude calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDensityAltitude(densityAltitudeExample.input)).toEqual({
      ok: true,
      output: densityAltitudeExample.output,
    });
  });

  it("increases with warmer air and decreases when colder than ISA", () => {
    const hot = calculateDensityAltitude({
      oatC: 35,
      pressureAltitudeFt: 2000,
    });
    const cold = calculateDensityAltitude({
      oatC: -5,
      pressureAltitudeFt: 2000,
    });
    expect(hot.densityAltitudeFt).toBeGreaterThan(cold.densityAltitudeFt);
  });

  it("matches ISA conditions at standard temperature", () => {
    // At 6000 ft, ISA is about 15 - 6*1.9812 = 3.1128 C.
    const isa = calculateDensityAltitude({
      oatC: 3.1128,
      pressureAltitudeFt: 6000,
    });
    expect(isa.densityAltitudeFt).toBeCloseTo(6000, 9);
  });
});
