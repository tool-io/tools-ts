import { describe, expect, it } from "vitest";
import {
  audioSplFromPressureExample,
  runAudioSplFromPressure,
} from "./tool.js";

const outputOf = (input: { soundPressurePa: number }) => {
  const result = runAudioSplFromPressure(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { soundPressureLevelDb: number };
};

describe("SPL From Pressure", () => {
  it("reproduces the canonical example", () =>
    expect(runAudioSplFromPressure(audioSplFromPressureExample.input)).toEqual({
      ok: true,
      output: { soundPressureLevelDb: 93.97940008672037 },
    }));

  it("references twenty micropascals as zero dB SPL", () =>
    expect(
      outputOf({ soundPressurePa: 0.00002 }).soundPressureLevelDb,
    ).toBeCloseTo(0, 12));

  it("adds six decibels per pressure doubling", () => {
    const base = outputOf({ soundPressurePa: 0.25 }).soundPressureLevelDb;
    const doubled = outputOf({ soundPressurePa: 0.5 }).soundPressureLevelDb;
    expect(doubled - base).toBeCloseTo(20 * Math.log10(2), 12);
  });

  it("gains twenty decibels per decade of pressure", () => {
    const one = outputOf({ soundPressurePa: 1 }).soundPressureLevelDb;
    const ten = outputOf({ soundPressurePa: 10 }).soundPressureLevelDb;
    expect(ten - one).toBeCloseTo(20, 12);
  });

  it("matches twenty log ten of the reference ratio", () => {
    const { soundPressureLevelDb } = outputOf({ soundPressurePa: 6.32 });
    expect(soundPressureLevelDb).toBeCloseTo(
      20 * Math.log10(6.32 / 0.00002),
      12,
    );
  });

  it("handles very quiet pressures near the threshold of hearing", () =>
    expect(
      outputOf({ soundPressurePa: 2e-5 }).soundPressureLevelDb,
    ).toBeCloseTo(0, 12));

  it("rejects non-positive pressure", () => {
    expect(runAudioSplFromPressure({ soundPressurePa: 0 }).ok).toBe(false);
    expect(runAudioSplFromPressure({ soundPressurePa: -1 }).ok).toBe(false);
  });

  it("rejects unknown fields", () =>
    expect(
      runAudioSplFromPressure({
        extra: true,
        soundPressurePa: 1,
      } as unknown as { soundPressurePa: number }).ok,
    ).toBe(false));
});
