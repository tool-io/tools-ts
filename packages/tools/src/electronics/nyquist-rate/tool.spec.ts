import { describe, expect, it } from "vitest";
import { nyquistRateExample, runNyquistRate } from "./tool.js";

describe("Nyquist Rate", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runNyquistRate(nyquistRateExample.input)).toEqual({
      ok: true,
      output: { nyquistRateHz: 40000 },
    }));
  it("doubles fractional frequencies", () =>
    expect(runNyquistRate({ maxFrequencyHz: 2500.5 })).toEqual({
      ok: true,
      output: { nyquistRateHz: 5001 },
    }));
  it("doubles the smallest positive frequency", () =>
    expect(runNyquistRate({ maxFrequencyHz: 1 })).toEqual({
      ok: true,
      output: { nyquistRateHz: 2 },
    }));
  it("rejects zero frequency", () =>
    expect(runNyquistRate({ maxFrequencyHz: 0 }).ok).toBe(false));
  it("rejects negative frequency", () =>
    expect(runNyquistRate({ maxFrequencyHz: -100 }).ok).toBe(false));
  it("rejects non-finite input", () =>
    expect(
      runNyquistRate({ maxFrequencyHz: Number.POSITIVE_INFINITY }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "maxFrequencyHz" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runNyquistRate({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "maxFrequencyHz" }],
      },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runNyquistRate({ ...nyquistRateExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
