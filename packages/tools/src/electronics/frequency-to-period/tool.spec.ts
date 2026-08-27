import { describe, expect, it } from "vitest";
import {
  calculateFrequencyToPeriod,
  frequencyToPeriodExample,
  runFrequencyToPeriod,
} from "./tool.js";

describe("frequency to period calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFrequencyToPeriod(frequencyToPeriodExample.input)).toEqual({
      ok: true,
      output: frequencyToPeriodExample.output,
    });
  });

  it("inverts the period relationship", () => {
    expect(
      calculateFrequencyToPeriod({ frequencyHz: 1000 }).periodSeconds,
    ).toBe(1e-3);
    expect(
      calculateFrequencyToPeriod({ frequencyHz: 440 }).periodSeconds,
    ).toBeCloseTo(1 / 440, 15);
  });

  it("rejects non-positive frequency through execution", () => {
    for (const f of [0, -50])
      expect(runFrequencyToPeriod({ frequencyHz: f }).ok).toBe(false);
  });
});
