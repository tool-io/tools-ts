import { describe, expect, it } from "vitest";
import { runSignalToNoiseRatio, signalToNoiseRatioExample } from "./tool.js";

describe("SNR Linear", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runSignalToNoiseRatio(signalToNoiseRatioExample.input)).toEqual({
      ok: true,
      output: { signalToNoiseRatio: 5 },
    }));
  it("allows a zero signal power", () =>
    expect(runSignalToNoiseRatio({ noiseWatts: 1, signalWatts: 0 })).toEqual({
      ok: true,
      output: { signalToNoiseRatio: 0 },
    }));
  it("reports fractional ratios", () =>
    expect(runSignalToNoiseRatio({ noiseWatts: 4, signalWatts: 1 })).toEqual({
      ok: true,
      output: { signalToNoiseRatio: 0.25 },
    }));
  it("rejects zero noise power", () =>
    expect(runSignalToNoiseRatio({ noiseWatts: 0, signalWatts: 1 }).ok).toBe(
      false,
    ));
  it("rejects negative signal power", () =>
    expect(runSignalToNoiseRatio({ noiseWatts: 1, signalWatts: -1 }).ok).toBe(
      false,
    ));
  it("rejects non-finite input", () =>
    expect(
      runSignalToNoiseRatio({ noiseWatts: Number.NaN, signalWatts: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "noiseWatts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runSignalToNoiseRatio({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "signalWatts" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runSignalToNoiseRatio({
        ...signalToNoiseRatioExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
