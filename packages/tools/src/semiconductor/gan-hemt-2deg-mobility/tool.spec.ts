import { describe, expect, it } from "vitest";
import { ganHemt2degMobilityExample, runGanHemt2degMobility } from "./tool.js";

describe("GaN HEMT 2DEG Mobility Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGanHemt2degMobility(ganHemt2degMobilityExample.input)).toEqual({
      ok: true,
      output: ganHemt2degMobilityExample.output,
    });
  });

  it("uses the sheet-conductance relation 1/(q ns Rs)", () => {
    const result = runGanHemt2degMobility({
      sheetDensityPerCm2: 2e13,
      sheetResistanceOhmsPerSquare: 250,
    });
    expect(result).toEqual({
      ok: true,
      output: { mobilityCm2PerVoltSecond: 1248.3018148921526 },
    });
  });

  it("halves mobility when sheet resistance doubles", () => {
    const low = runGanHemt2degMobility({
      sheetDensityPerCm2: 1e13,
      sheetResistanceOhmsPerSquare: 500,
    });
    const high = runGanHemt2degMobility({
      sheetDensityPerCm2: 1e13,
      sheetResistanceOhmsPerSquare: 1_000,
    });
    expect(low.ok && high.ok).toBe(true);
    if (low.ok && high.ok)
      expect(high.output.mobilityCm2PerVoltSecond).toBe(
        low.output.mobilityCm2PerVoltSecond / 2,
      );
  });

  it("rejects non-positive, non-finite, and missing measurements", () => {
    for (const input of [
      { sheetDensityPerCm2: 0, sheetResistanceOhmsPerSquare: 500 },
      { sheetDensityPerCm2: 1e13, sheetResistanceOhmsPerSquare: -1 },
      {
        sheetDensityPerCm2: Number.NaN,
        sheetResistanceOhmsPerSquare: 500,
      },
      { sheetDensityPerCm2: 1e13 },
    ])
      expect(runGanHemt2degMobility(input).ok).toBe(false);
  });
});
