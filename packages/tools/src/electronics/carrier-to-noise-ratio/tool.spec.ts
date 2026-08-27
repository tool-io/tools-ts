import { describe, expect, it } from "vitest";
import { runCarrierToNoiseRatio } from "./tool.js";

describe("C/N Ratio dB", () => {
  it("calculates a valid result", () =>
    expect(
      runCarrierToNoiseRatio({ carrierPowerDbm: -50, noisePowerDbm: -105 }),
    ).toEqual({
      ok: true,
      output: { carrierToNoiseDb: 55 },
    }));
  it("handles positive carrier levels", () =>
    expect(
      runCarrierToNoiseRatio({ carrierPowerDbm: 10, noisePowerDbm: -90 }),
    ).toEqual({
      ok: true,
      output: { carrierToNoiseDb: 100 },
    }));
  it("returns zero for equal powers", () =>
    expect(
      runCarrierToNoiseRatio({ carrierPowerDbm: -45, noisePowerDbm: -45 }),
    ).toEqual({
      ok: true,
      output: { carrierToNoiseDb: 0 },
    }));
  it("returns negative ratio for a signal buried in noise", () =>
    expect(
      runCarrierToNoiseRatio({ carrierPowerDbm: -120, noisePowerDbm: -110 }),
    ).toEqual({
      ok: true,
      output: { carrierToNoiseDb: -10 },
    }));
  it("supports fractional levels", () =>
    expect(
      runCarrierToNoiseRatio({
        carrierPowerDbm: -50.5,
        noisePowerDbm: -100.25,
      }),
    ).toEqual({
      ok: true,
      output: { carrierToNoiseDb: 49.75 },
    }));
  it("rejects a non-finite carrier power", () =>
    expect(
      runCarrierToNoiseRatio({
        carrierPowerDbm: Number.NaN,
        noisePowerDbm: -105,
      }).ok,
    ).toBe(false));
  it("rejects a non-finite noise power", () =>
    expect(
      runCarrierToNoiseRatio({
        carrierPowerDbm: -50,
        noisePowerDbm: Number.NEGATIVE_INFINITY,
      }).ok,
    ).toBe(false));
});
