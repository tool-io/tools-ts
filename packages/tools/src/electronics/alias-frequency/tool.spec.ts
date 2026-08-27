import { describe, expect, it } from "vitest";
import { aliasFrequencyExample, runAliasFrequency } from "./tool.js";

describe("Alias Frequency", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runAliasFrequency(aliasFrequencyExample.input)).toEqual({
      ok: true,
      output: { aliasFrequencyHz: 1500 },
    }));
  it("folds to zero at exact multiples of the sample rate", () =>
    expect(
      runAliasFrequency({ sampleRateHz: 6000, signalFreqHz: 12000 }),
    ).toEqual({
      ok: true,
      output: { aliasFrequencyHz: 0 },
    }));
  it("leaves below-Nyquist signals unchanged", () =>
    expect(
      runAliasFrequency({ sampleRateHz: 6000, signalFreqHz: 3000 }),
    ).toEqual({
      ok: true,
      output: { aliasFrequencyHz: 3000 },
    }));
  it("folds higher-order aliases back into the baseband", () =>
    expect(
      runAliasFrequency({ sampleRateHz: 6000, signalFreqHz: 13500 }),
    ).toEqual({
      ok: true,
      output: { aliasFrequencyHz: 1500 },
    }));
  it("rejects zero signal frequency", () =>
    expect(runAliasFrequency({ sampleRateHz: 6000, signalFreqHz: 0 }).ok).toBe(
      false,
    ));
  it("rejects zero sample rate", () =>
    expect(runAliasFrequency({ sampleRateHz: 0, signalFreqHz: 7500 }).ok).toBe(
      false,
    ));
  it("rejects non-finite input", () =>
    expect(
      runAliasFrequency({ sampleRateHz: Number.NaN, signalFreqHz: 7500 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "sampleRateHz" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runAliasFrequency({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "signalFreqHz" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runAliasFrequency({
        ...aliasFrequencyExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
