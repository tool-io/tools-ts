import { describe, expect, it } from "vitest";
import { runWesternBlotBandIntensity } from "./tool.js";

describe("Band Intensity Ratio", () => {
  it("calculates a valid result", () =>
    expect(
      runWesternBlotBandIntensity({
        loadingControlIntensity: 500,
        targetBandIntensity: 750,
      }),
    ).toEqual({
      ok: true,
      output: { normalizedRatio: 1.5 },
    }));
  it("returns one when both bands match", () =>
    expect(
      runWesternBlotBandIntensity({
        loadingControlIntensity: 320,
        targetBandIntensity: 320,
      }),
    ).toEqual({
      ok: true,
      output: { normalizedRatio: 1 },
    }));
  it("accepts a missing target band", () =>
    expect(
      runWesternBlotBandIntensity({
        loadingControlIntensity: 400,
        targetBandIntensity: 0,
      }),
    ).toEqual({
      ok: true,
      output: { normalizedRatio: 0 },
    }));
  it("supports sub-unit ratios", () => {
    const result = runWesternBlotBandIntensity({
      loadingControlIntensity: 800,
      targetBandIntensity: 200,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.normalizedRatio).toBe(0.25);
  });
  it("rejects zero loading control", () => {
    const result = runWesternBlotBandIntensity({
      loadingControlIntensity: 0,
      targetBandIntensity: 100,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_control");
  });
  it("rejects negative loading control", () =>
    expect(
      runWesternBlotBandIntensity({
        loadingControlIntensity: -50,
        targetBandIntensity: 100,
      }).ok,
    ).toBe(false));
  it("rejects negative target intensity", () =>
    expect(
      runWesternBlotBandIntensity({
        loadingControlIntensity: 500,
        targetBandIntensity: -10,
      }).ok,
    ).toBe(false));
});
