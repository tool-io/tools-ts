import { describe, expect, it } from "vitest";
import { runSoundSignalRange, soundSignalRangeExample } from "./tool.js";

describe("Sound Signal Range", () => {
  it("calculates the canonical example exactly", () => {
    expect(runSoundSignalRange(soundSignalRangeExample.input)).toEqual({
      ok: true,
      output: { soundRangeNm: 1 },
    });
  });

  it("gives half a mile for quieter whistles", () => {
    expect(runSoundSignalRange({ whistleDecibels: 90 })).toEqual({
      ok: true,
      output: { soundRangeNm: 0.5 },
    });
    expect(runSoundSignalRange({ whistleDecibels: 109.9 })).toEqual({
      ok: true,
      output: { soundRangeNm: 0.5 },
    });
  });

  it("starts one mile at exactly one hundred and ten decibels", () => {
    expect(runSoundSignalRange({ whistleDecibels: 110 })).toEqual({
      ok: true,
      output: { soundRangeNm: 1 },
    });
  });

  it("starts two miles at exactly one hundred and thirty decibels", () => {
    expect(runSoundSignalRange({ whistleDecibels: 130 })).toEqual({
      ok: true,
      output: { soundRangeNm: 2 },
    });
    expect(runSoundSignalRange({ whistleDecibels: 150 })).toEqual({
      ok: true,
      output: { soundRangeNm: 2 },
    });
  });

  it("accepts fractional decibel levels inside the declared range", () => {
    expect(runSoundSignalRange({ whistleDecibels: 120.5 })).toEqual({
      ok: true,
      output: { soundRangeNm: 1 },
    });
  });

  it("rejects levels outside ninety to one hundred fifty decibels", () => {
    expect(runSoundSignalRange({ whistleDecibels: 89 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "whistleDecibels" }] },
      ok: false,
    });
    expect(runSoundSignalRange({ whistleDecibels: 151 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "whistleDecibels" }] },
      ok: false,
    });
  });

  it("rejects non-finite levels", () => {
    expect(runSoundSignalRange({ whistleDecibels: Number.NaN }).ok).toBe(false);
  });

  it("rejects unknown fields and null input", () => {
    expect(
      runSoundSignalRange({ hornSeconds: 5, whistleDecibels: 121 }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "hornSeconds" }] },
      ok: false,
    });
    expect(runSoundSignalRange(null).ok).toBe(false);
    expect(runSoundSignalRange({}).ok).toBe(false);
  });
});
