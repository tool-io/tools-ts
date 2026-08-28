import { describe, expect, it } from "vitest";
import {
  calculateStriplineImpedanceApprox,
  runStriplineImpedanceApprox,
  striplineImpedanceApproxExample,
} from "./tool.js";

describe("Stripline Z Approx", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runStriplineImpedanceApprox(striplineImpedanceApproxExample.input),
    ).toEqual({ ok: true, output: striplineImpedanceApproxExample.output });
  });

  it("matches the closed-form formula on another geometry", () => {
    expect(
      calculateStriplineImpedanceApprox({
        dielectricConstEr: 2.2,
        heightMm: 1,
        traceThicknessMm: 0,
        widthMm: 1,
      }).striplineImpedanceOhms,
    ).toBe((60 / Math.sqrt(2.2)) * Math.log(4 / (0.67 * Math.PI * 0.8)));
  });

  it("lowers impedance for wider traces", () => {
    const narrow = calculateStriplineImpedanceApprox({
      dielectricConstEr: 4.5,
      heightMm: 0.8,
      traceThicknessMm: 0.035,
      widthMm: 0.3,
    }).striplineImpedanceOhms;
    const wide = calculateStriplineImpedanceApprox({
      dielectricConstEr: 4.5,
      heightMm: 0.8,
      traceThicknessMm: 0.035,
      widthMm: 1,
    }).striplineImpedanceOhms;
    expect(wide).toBeLessThan(narrow);
  });

  it("scales with the inverse square root of permittivity", () => {
    const base = calculateStriplineImpedanceApprox(
      striplineImpedanceApproxExample.input,
    ).striplineImpedanceOhms;
    const doubled = calculateStriplineImpedanceApprox({
      ...striplineImpedanceApproxExample.input,
      dielectricConstEr: 18,
    }).striplineImpedanceOhms;
    expect(doubled).toBeCloseTo(base / 2, 12);
  });

  it("rejects a permittivity of one or less", () => {
    expect(
      runStriplineImpedanceApprox({
        dielectricConstEr: 0.5,
        heightMm: 0.8,
        traceThicknessMm: 0.035,
        widthMm: 0.5,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive geometry", () => {
    expect(
      runStriplineImpedanceApprox({
        dielectricConstEr: 4.5,
        heightMm: -0.8,
        traceThicknessMm: 0.035,
        widthMm: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runStriplineImpedanceApprox({
        dielectricConstEr: 4.5,
        heightMm: 0.8,
        traceThicknessMm: 0.035,
        widthMm: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative trace thickness with invalid_geometry or invalid_thickness", () => {
    const negative = runStriplineImpedanceApprox({
      dielectricConstEr: 4.5,
      heightMm: 0.8,
      traceThicknessMm: -1,
      widthMm: 0.5,
    });
    expect(negative.ok).toBe(false);
    if (!negative.ok)
      expect(negative.error.issues[0]?.code).toBe("invalid_thickness");
  });
});
