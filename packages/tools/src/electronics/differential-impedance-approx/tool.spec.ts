import { describe, expect, it } from "vitest";
import {
  calculateDifferentialImpedanceApprox,
  differentialImpedanceApproxExample,
  runDifferentialImpedanceApprox,
} from "./tool.js";

describe("Differential Z Approx", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDifferentialImpedanceApprox(differentialImpedanceApproxExample.input),
    ).toEqual({ ok: true, output: differentialImpedanceApproxExample.output });
  });

  it("matches the documented approximation formula", () => {
    expect(
      calculateDifferentialImpedanceApprox({
        gapMm: 0.15,
        heightMm: 0.8,
        microstripSingleOhms: 55,
      }).differentialImpedanceOhms,
    ).toBe(2 * 55 * (1 - 0.48 * Math.exp((-0.96 * 0.15) / 0.8)));
  });

  it("approaches twice the single-ended impedance for a wide gap", () => {
    expect(
      calculateDifferentialImpedanceApprox({
        gapMm: 1000,
        heightMm: 1,
        microstripSingleOhms: 50,
      }).differentialImpedanceOhms,
    ).toBeCloseTo(100, 9);
  });

  it("stays below twice the single-ended impedance for tight gaps", () => {
    const result = calculateDifferentialImpedanceApprox({
      gapMm: 0.05,
      heightMm: 1,
      microstripSingleOhms: 50,
    }).differentialImpedanceOhms;
    expect(result).toBeGreaterThan(2);
    expect(result).toBeLessThan(100);
  });

  it("increases as the gap widens at fixed geometry", () => {
    const tight = calculateDifferentialImpedanceApprox({
      gapMm: 0.1,
      heightMm: 1,
      microstripSingleOhms: 50,
    }).differentialImpedanceOhms;
    const loose = calculateDifferentialImpedanceApprox({
      gapMm: 1,
      heightMm: 1,
      microstripSingleOhms: 50,
    }).differentialImpedanceOhms;
    expect(loose).toBeGreaterThan(tight);
  });

  it("rejects a non-positive single-ended impedance", () => {
    expect(
      runDifferentialImpedanceApprox({
        gapMm: 0.2,
        heightMm: 1.6,
        microstripSingleOhms: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive gap and height", () => {
    expect(
      runDifferentialImpedanceApprox({
        gapMm: 0,
        heightMm: 1.6,
        microstripSingleOhms: 50,
      }).ok,
    ).toBe(false);
    expect(
      runDifferentialImpedanceApprox({
        gapMm: 0.2,
        heightMm: 0,
        microstripSingleOhms: 50,
      }).ok,
    ).toBe(false);
  });
});
