import { describe, expect, it } from "vitest";
import {
  runWaveMakingResistance,
  waveMakingResistanceExample,
} from "./tool.js";

describe("Wave Making Resistance Ratio", () => {
  it("calculates the canonical example", () =>
    expect(runWaveMakingResistance(waveMakingResistanceExample.input)).toEqual({
      ok: true,
      output: waveMakingResistanceExample.output,
    }));
  it("returns one hundred percent for pure wavemaking drag", () =>
    expect(
      runWaveMakingResistance({
        totalResistanceNewtons: 500,
        waveResistanceNewtons: 500,
      }),
    ).toEqual({ ok: true, output: { wavemakingRatioPercent: 100 } }));
  it("returns fractional percentages", () =>
    expect(
      runWaveMakingResistance({
        totalResistanceNewtons: 1000,
        waveResistanceNewtons: 125,
      }),
    ).toEqual({ ok: true, output: { wavemakingRatioPercent: 12.5 } }));
  it("rejects a component larger than total resistance", () =>
    expect(
      runWaveMakingResistance({
        totalResistanceNewtons: 500,
        waveResistanceNewtons: 600,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "inconsistent_components" }] },
      ok: false,
    }));
  it("is invariant under proportional scaling", () =>
    expect(
      runWaveMakingResistance({
        totalResistanceNewtons: 2000,
        waveResistanceNewtons: 500,
      }),
    ).toEqual({ ok: true, output: { wavemakingRatioPercent: 25 } }));
  it("returns zero for zero wave resistance", () => {
    const result = runWaveMakingResistance({
      totalResistanceNewtons: 1000,
      waveResistanceNewtons: 0,
    });
    expect(result).toEqual({
      ok: true,
      output: { wavemakingRatioPercent: 0 },
    });
  });
  it("rejects a zero total resistance", () => {
    const result = runWaveMakingResistance({
      totalResistanceNewtons: 0,
      waveResistanceNewtons: 250,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_total_resistance");
  });
  it("rejects negative, missing and malformed input", () => {
    expect(
      runWaveMakingResistance({
        totalResistanceNewtons: -1000,
        waveResistanceNewtons: 250,
      }).ok,
    ).toBe(false);
    expect(runWaveMakingResistance({}).ok).toBe(false);
    expect(
      runWaveMakingResistance({
        totalResistanceNewtons: "1000",
        waveResistanceNewtons: 250,
      }).ok,
    ).toBe(false);
    expect(runWaveMakingResistance(null).ok).toBe(false);
  });
});
