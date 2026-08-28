import { describe, expect, it } from "vitest";
import {
  calculateResonantFrequency,
  resonantFrequencyExample,
  runResonantFrequency,
} from "./tool.js";

describe("resonant frequency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runResonantFrequency(resonantFrequencyExample.input)).toEqual({
      ok: true,
      output: resonantFrequencyExample.output,
    });
  });

  it("drops by the square root of four when capacitance quadruples", () => {
    const base = calculateResonantFrequency({
      capacitanceF: 1e-6,
      inductanceH: 0.01,
    }).resonantFrequencyHz;
    const heavier = calculateResonantFrequency({
      capacitanceF: 4e-6,
      inductanceH: 0.01,
    }).resonantFrequencyHz;
    expect(heavier).toBeCloseTo(base / 2, 9);
  });

  it("rejects non-positive L or C through execution", () => {
    for (const bad of [
      { capacitanceF: 0, inductanceH: 0.01 },
      { capacitanceF: 1e-6, inductanceH: -0.01 },
    ])
      expect(runResonantFrequency(bad).ok).toBe(false);
  });
});
