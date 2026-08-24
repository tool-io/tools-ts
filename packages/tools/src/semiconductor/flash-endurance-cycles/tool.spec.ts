import { describe, expect, it } from "vitest";
import {
  calculateFlashEnduranceCycles,
  flashEnduranceCyclesExample,
  runFlashEnduranceCycles,
} from "./tool.js";

describe("Flash Endurance Cycles Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFlashEnduranceCycles(flashEnduranceCyclesExample.input)).toEqual({
      ok: true,
      output: flashEnduranceCyclesExample.output,
    });
  });

  it("reports unused rated endurance before cycling", () => {
    expect(
      calculateFlashEnduranceCycles({
        completedCycleCount: 0,
        ratedCycleCount: 10_000,
      }),
    ).toEqual({ enduranceUsedPercent: 0, remainingCycles: 10_000 });
  });

  it("clamps remaining cycles after the rating is exceeded", () => {
    expect(
      calculateFlashEnduranceCycles({
        completedCycleCount: 12_000,
        ratedCycleCount: 10_000,
      }),
    ).toEqual({ enduranceUsedPercent: 120, remainingCycles: 0 });
  });

  it("rejects invalid cycle counts", () => {
    for (const input of [
      { completedCycleCount: -1, ratedCycleCount: 10_000 },
      { completedCycleCount: 1.5, ratedCycleCount: 10_000 },
      { completedCycleCount: 1, ratedCycleCount: 0 },
      { completedCycleCount: 1, ratedCycleCount: 10.5 },
    ])
      expect(runFlashEnduranceCycles(input).ok).toBe(false);
  });

  it("rejects missing and unknown inputs", () => {
    expect(runFlashEnduranceCycles({}).ok).toBe(false);
    expect(
      runFlashEnduranceCycles({
        completedCycleCount: 1,
        extra: 1,
        ratedCycleCount: 10,
      }).ok,
    ).toBe(false);
  });
});
