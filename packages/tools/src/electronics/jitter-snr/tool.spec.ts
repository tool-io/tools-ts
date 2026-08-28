import { describe, expect, it } from "vitest";
import { jitterSnrExample, runJitterSnr } from "./tool.js";

describe("Jitter SNR Limit", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runJitterSnr(jitterSnrExample.input)).toEqual({
      ok: true,
      output: { jitterLimitedSnrDb: 104.03640263283769 },
    }));
  it("degrades for faster signals at equal jitter", () =>
    expect(
      runJitterSnr({
        jitterSecondsRms: 1e-12,
        signalFreqHz: 1000000000,
      }),
    ).toEqual({
      ok: true,
      output: { jitterLimitedSnrDb: 44.0364026328377 },
    }));
  it("reports the unit-frequency unit-jitter limit", () =>
    expect(runJitterSnr({ jitterSecondsRms: 1, signalFreqHz: 1 })).toEqual({
      ok: true,
      output: { jitterLimitedSnrDb: -15.9635973671623 },
    }));
  it("rejects zero signal frequency", () =>
    expect(runJitterSnr({ jitterSecondsRms: 1e-12, signalFreqHz: 0 }).ok).toBe(
      false,
    ));
  it("rejects zero jitter", () =>
    expect(
      runJitterSnr({ jitterSecondsRms: 0, signalFreqHz: 1000000 }).ok,
    ).toBe(false));
  it("rejects non-finite jitter", () =>
    expect(
      runJitterSnr({
        jitterSecondsRms: Number.NaN,
        signalFreqHz: 1000000,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "jitterSecondsRms" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runJitterSnr({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "signalFreqHz" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runJitterSnr({ ...jitterSnrExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
