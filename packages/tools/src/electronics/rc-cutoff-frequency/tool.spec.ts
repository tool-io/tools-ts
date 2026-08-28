import { describe, expect, it } from "vitest";
import {
  calculateRcCutoffFrequency,
  rcCutoffFrequencyExample,
  runRcCutoffFrequency,
} from "./tool.js";

describe("rc cutoff frequency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRcCutoffFrequency(rcCutoffFrequencyExample.input)).toEqual({
      ok: true,
      output: rcCutoffFrequencyExample.output,
    });
  });

  it("halves the cutoff when resistance doubles", () => {
    const base = calculateRcCutoffFrequency({
      capacitanceF: 1e-6,
      resistanceOhms: 1000,
    }).cutoffFrequencyHz;
    expect(
      calculateRcCutoffFrequency({ capacitanceF: 1e-6, resistanceOhms: 2000 })
        .cutoffFrequencyHz,
    ).toBeCloseTo(base / 2, 12);
    expect(
      calculateRcCutoffFrequency({
        capacitanceF: 1e-9,
        resistanceOhms: 1591.5494309189535,
      }).cutoffFrequencyHz,
    ).toBeCloseTo(100000, 3);
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { capacitanceF: 0, resistanceOhms: 1000 },
      { capacitanceF: 1e-6, resistanceOhms: -1000 },
    ])
      expect(runRcCutoffFrequency(bad).ok).toBe(false);
  });
});
