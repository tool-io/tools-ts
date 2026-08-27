import { describe, expect, it } from "vitest";
import {
  calculateCoplanarWaveguideImpedance,
  coplanarWaveguideImpedanceExample,
  runCoplanarWaveguideImpedance,
} from "./tool.js";

describe("CPW Impedance Approx", () => {
  it("reproduces its canonical example with the default permittivity", () => {
    expect(
      runCoplanarWaveguideImpedance(coplanarWaveguideImpedanceExample.input),
    ).toEqual({ ok: true, output: coplanarWaveguideImpedanceExample.output });
  });

  it("matches the simplified formula for an explicit permittivity", () => {
    expect(
      calculateCoplanarWaveguideImpedance({
        erEffective: 9,
        gapMm: 0.1,
        traceWidthMm: 0.4,
      }).coplanarImpedanceOhms,
    ).toBe((60 / Math.sqrt(9)) * Math.log((4 * (0.2 + 0.1)) / 0.2));
  });

  it("scales inversely with the square root of permittivity", () => {
    const base = calculateCoplanarWaveguideImpedance({
      gapMm: 0.2,
      traceWidthMm: 0.5,
    }).coplanarImpedanceOhms;
    const dense = calculateCoplanarWaveguideImpedance({
      erEffective: 16,
      gapMm: 0.2,
      traceWidthMm: 0.5,
    }).coplanarImpedanceOhms;
    expect(dense).toBeCloseTo(base / 2, 12);
  });

  it("increases as the gap widens", () => {
    const tight = calculateCoplanarWaveguideImpedance({
      gapMm: 0.05,
      traceWidthMm: 0.5,
    }).coplanarImpedanceOhms;
    const wide = calculateCoplanarWaveguideImpedance({
      gapMm: 0.5,
      traceWidthMm: 0.5,
    }).coplanarImpedanceOhms;
    expect(wide).toBeGreaterThan(tight);
  });

  it("accepts a zero gap", () => {
    expect(
      runCoplanarWaveguideImpedance({ gapMm: 0, traceWidthMm: 0.5 }).ok,
    ).toBe(true);
  });

  it("rejects a permittivity of one or less", () => {
    expect(
      runCoplanarWaveguideImpedance({
        erEffective: 1,
        gapMm: 0.2,
        traceWidthMm: 0.5,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-positive trace width", () => {
    expect(
      runCoplanarWaveguideImpedance({ gapMm: 0.2, traceWidthMm: 0 }).ok,
    ).toBe(false);
  });

  it("rejects a negative gap", () => {
    expect(
      runCoplanarWaveguideImpedance({ gapMm: -0.2, traceWidthMm: 0.5 }).ok,
    ).toBe(false);
  });
});
