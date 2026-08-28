import { describe, expect, it } from "vitest";
import {
  calculatePiezoelectricResonantFrequency,
  piezoelectricResonantFrequencyExample,
  runPiezoelectricResonantFrequency,
} from "./tool.js";

describe("Piezo Resonant Frequency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPiezoelectricResonantFrequency(
        piezoelectricResonantFrequencyExample.input,
      ),
    ).toEqual({
      ok: true,
      output: piezoelectricResonantFrequencyExample.output,
    });
  });

  it("gives the documented constant for a one-millimeter plate", () => {
    expect(runPiezoelectricResonantFrequency({ thicknessMm: 1 })).toEqual({
      ok: true,
      output: { resonantFrequencyKhz: 2860 },
    });
  });

  it("doubles frequency when thickness halves", () => {
    const thick = calculatePiezoelectricResonantFrequency({
      thicknessMm: 2,
    }).resonantFrequencyKhz;
    const thin = calculatePiezoelectricResonantFrequency({
      thicknessMm: 1,
    }).resonantFrequencyKhz;
    expect(thin).toBe(thick * 2);
  });

  it("matches a common 2 MHz ultrasonic stack", () => {
    expect(
      calculatePiezoelectricResonantFrequency({ thicknessMm: 1.43 })
        .resonantFrequencyKhz,
    ).toBeCloseTo(2000, 10);
  });

  it("rejects zero thickness via invalid_thickness", () => {
    expect(runPiezoelectricResonantFrequency({ thicknessMm: 0 })).toMatchObject(
      {
        error: {
          issues: [{ code: "invalid_thickness", field: "thicknessMm" }],
        },
        ok: false,
      },
    );
  });

  it("rejects negative thickness via invalid_thickness", () => {
    expect(
      runPiezoelectricResonantFrequency({ thicknessMm: -0.5 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_thickness", field: "thicknessMm" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runPiezoelectricResonantFrequency({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "thicknessMm" }] },
      ok: false,
    });
  });
});
