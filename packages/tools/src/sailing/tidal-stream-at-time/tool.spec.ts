import { describe, expect, it } from "vitest";
import { runTidalStreamAtTime, tidalStreamAtTimeExample } from "./tool.js";

describe("Tidal Stream at Time Calculator", () => {
  it("calculates the canonical example", () =>
    expect(runTidalStreamAtTime(tidalStreamAtTimeExample.input)).toEqual({
      ok: true,
      output: tidalStreamAtTimeExample.output,
    }));
  it("returns zero slack water at cycle start", () => {
    const result = runTidalStreamAtTime({
      halfPeriodHours: 6.2,
      hoursIntoCycle: 0,
      peakStreamKt: 3,
    });
    expect(result).toEqual({ ok: true, output: { streamKt: 0 } });
  });
  it("peaks at half the half period", () => {
    expect(
      runTidalStreamAtTime({
        halfPeriodHours: 6.2,
        hoursIntoCycle: 3.1,
        peakStreamKt: 3,
      }),
    ).toEqual({ ok: true, output: { streamKt: 3 } });
    expect(
      runTidalStreamAtTime({
        halfPeriodHours: 6,
        hoursIntoCycle: 3,
        peakStreamKt: 4,
      }),
    ).toEqual({ ok: true, output: { streamKt: 4 } });
  });
  it("returns quarter-cycle values between zero and peak", () => {
    expect(
      runTidalStreamAtTime({
        halfPeriodHours: 6.2,
        hoursIntoCycle: 1.55,
        peakStreamKt: 3,
      }),
    ).toEqual({ ok: true, output: { streamKt: 2.1213203435596424 } });
    expect(
      runTidalStreamAtTime({
        halfPeriodHours: 6.2,
        hoursIntoCycle: 4.65,
        peakStreamKt: 3,
      }),
    ).toEqual({ ok: true, output: { streamKt: 2.121320343559643 } });
  });
  it("reverses sign on the ebb lobe", () => {
    expect(
      runTidalStreamAtTime({
        halfPeriodHours: 6.2,
        hoursIntoCycle: 9.3,
        peakStreamKt: 3,
      }),
    ).toEqual({ ok: true, output: { streamKt: -3 } });
  });
  it("stays bounded across repeated cycles", () => {
    const result = runTidalStreamAtTime({
      halfPeriodHours: 6.2,
      hoursIntoCycle: 12.4,
      peakStreamKt: 3,
    });
    if (result.ok)
      expect(Math.abs(Number(result.output.streamKt))).toBeLessThan(1e-12);
    else throw new Error("expected success");
  });
  it("rejects non-positive peak stream with invalid_peak", () => {
    const result = runTidalStreamAtTime({
      halfPeriodHours: 6.2,
      hoursIntoCycle: 1,
      peakStreamKt: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_peak");
  });
  it("rejects non-positive half period with invalid_half_period", () => {
    const result = runTidalStreamAtTime({
      halfPeriodHours: 0,
      hoursIntoCycle: 1,
      peakStreamKt: 3,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_half_period");
  });
  it("rejects negative times and malformed input", () => {
    expect(
      runTidalStreamAtTime({
        halfPeriodHours: 6.2,
        hoursIntoCycle: -1,
        peakStreamKt: 3,
      }).ok,
    ).toBe(false);
    expect(runTidalStreamAtTime(null).ok).toBe(false);
    expect(runTidalStreamAtTime({}).ok).toBe(false);
    expect(
      runTidalStreamAtTime({
        halfPeriodHours: "6",
        hoursIntoCycle: 1,
        peakStreamKt: 3,
      }).ok,
    ).toBe(false);
  });
});
