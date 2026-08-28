import { describe, expect, it } from "vitest";
import {
  calculateQuarterWaveAntennaLength,
  quarterWaveAntennaLengthExample,
  runQuarterWaveAntennaLength,
} from "./tool.js";

describe("quarter wave antenna length calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runQuarterWaveAntennaLength(quarterWaveAntennaLengthExample.input),
    ).toEqual({
      ok: true,
      output: quarterWaveAntennaLengthExample.output,
    });
  });

  it("gives c over four f in free space and shortens with the velocity factor", () => {
    const freeSpace = calculateQuarterWaveAntennaLength({
      frequencyHz: 1e8,
    }).elementLengthM;
    expect(freeSpace).toBeCloseTo(299792458 / 4e8, 12);
    expect(
      calculateQuarterWaveAntennaLength({
        frequencyHz: 1e8,
        velocityFactor: 0.95,
      }).elementLengthM,
    ).toBeCloseTo(freeSpace * 0.95, 15);
    // Doubling frequency halves the element.
    expect(
      calculateQuarterWaveAntennaLength({ frequencyHz: 2e8 }).elementLengthM,
    ).toBeCloseTo(freeSpace / 2, 12);
  });

  it("rejects invalid inputs through execution", () => {
    for (const bad of [
      { frequencyHz: 0 },
      { frequencyHz: 1e8, velocityFactor: 0 },
      { frequencyHz: 1e8, velocityFactor: 1.1 },
    ])
      expect(runQuarterWaveAntennaLength(bad).ok).toBe(false);
  });
});
