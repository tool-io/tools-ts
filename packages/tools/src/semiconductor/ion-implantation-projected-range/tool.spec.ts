import { describe, expect, it } from "vitest";
import {
  implantProjectedRangeExample,
  runImplantProjectedRange,
} from "./tool.js";

describe("Implant Projected Range Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runImplantProjectedRange(implantProjectedRangeExample.input),
    ).toEqual({
      ok: true,
      output: implantProjectedRangeExample.output,
    });
  });

  it("scales energy by the material-specific range coefficient", () => {
    expect(
      runImplantProjectedRange({
        ionEnergyKev: 200,
        rangeCoefficientNmPerKev: 1.5,
      }),
    ).toEqual({ ok: true, output: { projectedRangeNm: 300 } });
  });

  it("requires a positive coefficient and supported positive energy", () => {
    for (const input of [
      { ionEnergyKev: 100 },
      { ionEnergyKev: 100, rangeCoefficientNmPerKev: 0 },
      { ionEnergyKev: 0, rangeCoefficientNmPerKev: 1 },
      { ionEnergyKev: 5001, rangeCoefficientNmPerKev: 1 },
    ])
      expect(runImplantProjectedRange(input).ok).toBe(false);
  });
});
