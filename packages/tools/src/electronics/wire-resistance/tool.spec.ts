import { describe, expect, it } from "vitest";
import {
  calculateWireResistance,
  runWireResistance,
  wireResistanceExample,
} from "./tool.js";

describe("wire resistance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWireResistance(wireResistanceExample.input)).toEqual({
      ok: true,
      output: wireResistanceExample.output,
    });
  });

  it("doubles with length and halves with area", () => {
    const base = calculateWireResistance({
      crossSectionMm2: 1.5,
      lengthMeters: 10,
    }).resistanceOhms;
    expect(
      calculateWireResistance({
        crossSectionMm2: 1.5,
        lengthMeters: 20,
      }).resistanceOhms,
    ).toBeCloseTo(base * 2, 12);
    expect(
      calculateWireResistance({
        crossSectionMm2: 3,
        lengthMeters: 10,
      }).resistanceOhms,
    ).toBeCloseTo(base / 2, 12);
  });

  it("defaults to copper resistivity when omitted", () => {
    expect(
      runWireResistance({ crossSectionMm2: 1.5, lengthMeters: 10 }),
    ).toEqual(
      runWireResistance({
        crossSectionMm2: 1.5,
        lengthMeters: 10,
        resistivityOhmMeter: 1.68e-8,
      }),
    );
  });

  it("rejects non-positive inputs through execution", () => {
    for (const bad of [
      { crossSectionMm2: 0, lengthMeters: 10 },
      { crossSectionMm2: 1.5, lengthMeters: -10 },
      { crossSectionMm2: 1.5, lengthMeters: 10, resistivityOhmMeter: 0 },
    ])
      expect(runWireResistance(bad).ok).toBe(false);
  });
});
