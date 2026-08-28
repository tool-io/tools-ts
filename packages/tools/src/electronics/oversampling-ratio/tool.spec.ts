import { describe, expect, it } from "vitest";
import { oversamplingRatioExample, runOversamplingRatio } from "./tool.js";

describe("Oversampling Ratio", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runOversamplingRatio(oversamplingRatioExample.input)).toEqual({
      ok: true,
      output: { oversamplingRatio: 2 },
    }));
  it("reports unity for sampling at exactly the Nyquist rate", () =>
    expect(
      runOversamplingRatio({
        actualSampleRateHz: 22050,
        nyquistRequiredHz: 22050,
      }),
    ).toEqual({
      ok: true,
      output: { oversamplingRatio: 1 },
    }));
  it("handles fractional ratios", () =>
    expect(
      runOversamplingRatio({
        actualSampleRateHz: 44100,
        nyquistRequiredHz: 8000,
      }),
    ).toEqual({
      ok: true,
      output: { oversamplingRatio: 5.5125 },
    }));
  it("rejects zero actual sample rate", () =>
    expect(
      runOversamplingRatio({
        actualSampleRateHz: 0,
        nyquistRequiredHz: 24000,
      }).ok,
    ).toBe(false));
  it("rejects zero Nyquist requirement", () =>
    expect(
      runOversamplingRatio({
        actualSampleRateHz: 48000,
        nyquistRequiredHz: 0,
      }).ok,
    ).toBe(false));
  it("rejects non-finite input", () =>
    expect(
      runOversamplingRatio({
        actualSampleRateHz: 48000,
        nyquistRequiredHz: Number.NaN,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "nyquistRequiredHz" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runOversamplingRatio({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "actualSampleRateHz" }],
      },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runOversamplingRatio({
        ...oversamplingRatioExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
