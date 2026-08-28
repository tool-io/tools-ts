import { describe, expect, it } from "vitest";
import { nyquistFrequencyExample, runNyquistFrequency } from "./tool.js";

describe("Nyquist Frequency", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runNyquistFrequency(nyquistFrequencyExample.input)).toEqual({
      ok: true,
      output: { nyquistFrequencyHz: 22050 },
    }));
  it("halves fractional sample rates", () =>
    expect(runNyquistFrequency({ sampleRateHz: 1000.4 })).toEqual({
      ok: true,
      output: { nyquistFrequencyHz: 500.2 },
    }));
  it("halves the smallest valid sample rate", () =>
    expect(runNyquistFrequency({ sampleRateHz: 2 })).toEqual({
      ok: true,
      output: { nyquistFrequencyHz: 1 },
    }));
  it("rejects zero sample rate", () =>
    expect(runNyquistFrequency({ sampleRateHz: 0 }).ok).toBe(false));
  it("rejects negative sample rate", () =>
    expect(runNyquistFrequency({ sampleRateHz: -44100 }).ok).toBe(false));
  it("rejects non-finite input", () =>
    expect(runNyquistFrequency({ sampleRateHz: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "sampleRateHz" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runNyquistFrequency({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "sampleRateHz" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runNyquistFrequency({
        ...nyquistFrequencyExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
