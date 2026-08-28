import { describe, expect, it } from "vitest";
import { runTotalHarmonicDistortion } from "./tool.js";

describe("THD Percent", () => {
  it("calculates a valid result", () =>
    expect(
      runTotalHarmonicDistortion({
        fundamentalV: 1,
        harmonic2V: 0.01,
        harmonic3V: 0.005,
      }),
    ).toEqual({
      ok: true,
      output: { thdPercent: 1.118033988749895 },
    }));
  it("returns zero for a pure fundamental", () =>
    expect(
      runTotalHarmonicDistortion({
        fundamentalV: 2,
        harmonic2V: 0,
        harmonic3V: 0,
      }),
    ).toEqual({
      ok: true,
      output: { thdPercent: 0 },
    }));
  it("uses only the second harmonic when the third is zero", () =>
    expect(
      runTotalHarmonicDistortion({
        fundamentalV: 1,
        harmonic2V: 0.1,
        harmonic3V: 0,
      }),
    ).toEqual({
      ok: true,
      output: { thdPercent: 10 },
    }));
  it("uses only the third harmonic when the second is zero", () =>
    expect(
      runTotalHarmonicDistortion({
        fundamentalV: 1,
        harmonic2V: 0,
        harmonic3V: 0.05,
      }),
    ).toEqual({
      ok: true,
      output: { thdPercent: 5 },
    }));
  it("is invariant to scaling of all amplitudes", () =>
    expect(
      runTotalHarmonicDistortion({
        fundamentalV: 4,
        harmonic2V: 0.04,
        harmonic3V: 0.02,
      }),
    ).toEqual({
      ok: true,
      output: { thdPercent: 1.118033988749895 },
    }));
  it("rejects zero fundamental", () =>
    expect(
      runTotalHarmonicDistortion({
        fundamentalV: 0,
        harmonic2V: 0.01,
        harmonic3V: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative second harmonic", () =>
    expect(
      runTotalHarmonicDistortion({
        fundamentalV: 1,
        harmonic2V: -0.01,
        harmonic3V: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative third harmonic", () =>
    expect(
      runTotalHarmonicDistortion({
        fundamentalV: 1,
        harmonic2V: 0,
        harmonic3V: -0.005,
      }).ok,
    ).toBe(false));
});
