import { describe, expect, it } from "vitest";
import {
  calculatePeriodToFrequency,
  periodToFrequencyExample,
  runPeriodToFrequency,
} from "./tool.js";

describe("period to frequency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runPeriodToFrequency(periodToFrequencyExample.input)).toEqual({
      ok: true,
      output: periodToFrequencyExample.output,
    });
  });

  it("inverts the frequency relationship", () => {
    expect(
      calculatePeriodToFrequency({ periodSeconds: 1e-3 }).frequencyHz,
    ).toBe(1000);
    expect(
      calculatePeriodToFrequency({ periodSeconds: 1 / 440 }).frequencyHz,
    ).toBeCloseTo(440, 9);
  });

  it("rejects non-positive period through execution", () => {
    for (const t of [0, -0.02])
      expect(runPeriodToFrequency({ periodSeconds: t }).ok).toBe(false);
  });
});
