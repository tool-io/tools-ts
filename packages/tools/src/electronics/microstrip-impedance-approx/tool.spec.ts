import { describe, expect, it } from "vitest";
import {
  calculateMicrostripImpedanceApprox,
  microstripImpedanceApproxExample,
  runMicrostripImpedanceApprox,
} from "./tool.js";

describe("Microstrip Z Approx", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMicrostripImpedanceApprox(microstripImpedanceApproxExample.input),
    ).toEqual({ ok: true, output: microstripImpedanceApproxExample.output });
  });

  it("matches the closed-form formula for a thinner substrate", () => {
    expect(
      runMicrostripImpedanceApprox({
        dielectricConstEr: 4.5,
        heightMm: 0.8,
        traceThicknessMm: 0.035,
        widthMm: 2,
      }),
    ).toEqual({
      ok: true,
      output: {
        microstripImpedanceOhms:
          (87 / Math.sqrt(5.91)) * Math.log((5.98 * 0.8) / (1.6 + 0.035)),
      },
    });
  });

  it("lowers impedance when the trace widens", () => {
    const narrow = calculateMicrostripImpedanceApprox({
      dielectricConstEr: 4.4,
      heightMm: 1.6,
      traceThicknessMm: 0.035,
      widthMm: 1,
    }).microstripImpedanceOhms;
    const wide = calculateMicrostripImpedanceApprox({
      dielectricConstEr: 4.4,
      heightMm: 1.6,
      traceThicknessMm: 0.035,
      widthMm: 3,
    }).microstripImpedanceOhms;
    expect(wide).toBeLessThan(narrow);
  });

  it("lowers impedance for denser dielectrics", () => {
    const fr4 = calculateMicrostripImpedanceApprox({
      dielectricConstEr: 4.5,
      heightMm: 1.6,
      traceThicknessMm: 0.035,
      widthMm: 2,
    }).microstripImpedanceOhms;
    const rogers = calculateMicrostripImpedanceApprox({
      dielectricConstEr: 10.2,
      heightMm: 1.6,
      traceThicknessMm: 0.035,
      widthMm: 2,
    }).microstripImpedanceOhms;
    expect(rogers).toBeLessThan(fr4);
  });

  it("accepts zero trace thickness", () => {
    expect(
      runMicrostripImpedanceApprox({
        dielectricConstEr: 4.5,
        heightMm: 1.6,
        traceThicknessMm: 0,
        widthMm: 2,
      }).ok,
    ).toBe(true);
  });

  it("rejects a permittivity of one or less", () => {
    expect(
      runMicrostripImpedanceApprox({
        dielectricConstEr: 1,
        heightMm: 1.6,
        traceThicknessMm: 0.035,
        widthMm: 2,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive geometry", () => {
    expect(
      runMicrostripImpedanceApprox({
        dielectricConstEr: 4.5,
        heightMm: 0,
        traceThicknessMm: 0.035,
        widthMm: 2,
      }).ok,
    ).toBe(false);
    expect(
      runMicrostripImpedanceApprox({
        dielectricConstEr: 4.5,
        heightMm: 1.6,
        traceThicknessMm: 0.035,
        widthMm: -2,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative trace thickness", () => {
    expect(
      runMicrostripImpedanceApprox({
        dielectricConstEr: 4.5,
        heightMm: 1.6,
        traceThicknessMm: -0.035,
        widthMm: 2,
      }).ok,
    ).toBe(false);
  });
});
