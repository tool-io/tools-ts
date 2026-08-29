import { describe, expect, it } from "vitest";
import {
  streakingWindow,
  streakingWindowExample as example,
  runStreakingWindow,
} from "./tool.js";

describe("attosecond streaking window", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runStreakingWindow(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("derives the 800 nm half-cycle near 1334 as", () => {
    const out = streakingWindow({ xuvDurationAs: 100, irWavelengthNm: 800 });
    expect(out.irHalfCycleAs).toBeCloseTo(1334.256380792608, 9);
    expect(out.fitsWithinIrHalfCycle).toBe(true);
  });
  it("flags multi-cycle bursts as unresolvable", () => {
    const out = streakingWindow({ xuvDurationAs: 5000, irWavelengthNm: 800 });
    expect(out.fitsWithinIrHalfCycle).toBe(false);
  });
  it("rejects non-positive durations", () =>
    expect(
      runStreakingWindow({ xuvDurationAs: 0, irWavelengthNm: 800 }).ok,
    ).toBe(false));
});
