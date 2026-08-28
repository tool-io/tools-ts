import { describe, expect, it } from "vitest";
import {
  calculateSlewRateRequired,
  runSlewRateRequired,
  slewRateRequiredExample,
} from "./tool.js";

describe("Required Slew Rate", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSlewRateRequired(slewRateRequiredExample.input)).toEqual({
      ok: true,
      output: slewRateRequiredExample.output,
    });
  });

  it("rejects non-positive frequency", () => {
    expect(runSlewRateRequired({ frequencyHz: 0, peakVolts: 5 })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_frequency" }] },
        ok: false,
      },
    );
  });

  it("doubles required slew rate with doubled peak voltage", () => {
    expect(
      calculateSlewRateRequired({ frequencyHz: 20000, peakVolts: 10 })
        .slewRateVPerMicrosecond,
    ).toBeCloseTo(
      slewRateRequiredExample.output.slewRateVPerMicrosecond * 2,
      15,
    );
  });
});
