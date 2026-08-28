import { describe, expect, it } from "vitest";
import {
  calculatePllLoopBandwidth,
  pllLoopBandwidthExample,
  runPllLoopBandwidth,
} from "./tool.js";

describe("PLL Loop Bandwidth", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPllLoopBandwidth(pllLoopBandwidthExample.input)).toEqual({
      ok: true,
      output: pllLoopBandwidthExample.output,
    });
  });

  it("uses a default divisor of ten", () => {
    expect(
      calculatePllLoopBandwidth({
        loopDivideInt: 72,
        referenceFreqHz: 10000000,
      }).loopBandwidthHz,
    ).toBe(13888.888888888887);
  });

  it("matches the comparison frequency with a unit divisor", () => {
    expect(
      runPllLoopBandwidth({
        loopDivideInt: 4,
        referenceDividerForBandwidth: 1,
        referenceFreqHz: 40000000,
      }),
    ).toEqual({ ok: true, output: { loopBandwidthHz: 10000000 } });
  });

  it("narrows bandwidth as the loop divider grows", () => {
    const smallN = calculatePllLoopBandwidth({
      loopDivideInt: 10,
      referenceFreqHz: 120000000,
    }).loopBandwidthHz;
    const largeN = calculatePllLoopBandwidth({
      loopDivideInt: 1200,
      referenceFreqHz: 120000000,
    }).loopBandwidthHz;
    expect(largeN).toBe(smallN / 120);
  });

  it("scales linearly with reference frequency", () => {
    const low = calculatePllLoopBandwidth({
      loopDivideInt: 50,
      referenceFreqHz: 5000000,
    }).loopBandwidthHz;
    const high = calculatePllLoopBandwidth({
      loopDivideInt: 50,
      referenceFreqHz: 25000000,
    }).loopBandwidthHz;
    expect(high).toBe(low * 5);
  });

  it("rejects zero reference frequency via invalid_frequency", () => {
    expect(
      runPllLoopBandwidth({ loopDivideInt: 72, referenceFreqHz: 0 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_frequency", field: "referenceFreqHz" }],
      },
      ok: false,
    });
  });

  it("rejects a zero loop divider via invalid_field", () => {
    expect(
      runPllLoopBandwidth({ loopDivideInt: 0, referenceFreqHz: 10000000 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "loopDivideInt" }] },
      ok: false,
    });
  });

  it("rejects a fractional divisor via invalid_divider", () => {
    expect(() =>
      calculatePllLoopBandwidth({
        loopDivideInt: 72,
        referenceDividerForBandwidth: 2.5,
        referenceFreqHz: 10000000,
      }),
    ).toThrow();
  });

  it("rejects missing required inputs", () => {
    expect(runPllLoopBandwidth({ loopDivideInt: 72 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "referenceFreqHz" }] },
      ok: false,
    });
  });
});
