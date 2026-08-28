import { describe, expect, it } from "vitest";
import { runSignalToNoiseAndDistortion } from "./tool.js";

describe("SINAD dB", () => {
  it("calculates a valid result", () =>
    expect(
      runSignalToNoiseAndDistortion({
        fundamentalV: 1,
        distortionVSq: 0.000001,
        noiseVSq: 0.000001,
      }),
    ).toEqual({
      ok: true,
      output: { sinadDb: 56.98970004336019 },
    }));
  it("handles noise only", () =>
    expect(
      runSignalToNoiseAndDistortion({
        fundamentalV: 1,
        distortionVSq: 0,
        noiseVSq: 0.000001,
      }),
    ).toEqual({
      ok: true,
      output: { sinadDb: 60 },
    }));
  it("handles distortion only", () =>
    expect(
      runSignalToNoiseAndDistortion({
        fundamentalV: 1,
        distortionVSq: 0.000001,
        noiseVSq: 0,
      }),
    ).toEqual({
      ok: true,
      output: { sinadDb: 60 },
    }));
  it("scales with the fundamental amplitude", () =>
    expect(
      runSignalToNoiseAndDistortion({
        fundamentalV: 10,
        distortionVSq: 0.0001,
        noiseVSq: 0,
      }),
    ).toEqual({
      ok: true,
      output: { sinadDb: 60 },
    }));
  it("rejects zero fundamental", () =>
    expect(
      runSignalToNoiseAndDistortion({
        fundamentalV: 0,
        distortionVSq: 1e-6,
        noiseVSq: 1e-6,
      }).ok,
    ).toBe(false));
  it("rejects negative fundamental", () =>
    expect(
      runSignalToNoiseAndDistortion({
        fundamentalV: -1,
        distortionVSq: 1e-6,
        noiseVSq: 0,
      }).ok,
    ).toBe(false));
  it("rejects the absence of both noise and distortion", () => {
    const result = runSignalToNoiseAndDistortion({
      fundamentalV: 1,
      distortionVSq: 0,
      noiseVSq: 0,
    });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.issues[0]?.code).toBe(
      "no_distortion_or_noise",
    );
  });
});
