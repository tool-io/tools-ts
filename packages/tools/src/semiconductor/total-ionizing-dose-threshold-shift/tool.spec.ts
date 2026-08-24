import { describe, expect, it } from "vitest";
import {
  runTotalIonizingDoseThresholdShift,
  totalIonizingDoseThresholdShiftExample,
} from "./tool.js";

describe("total-ionizing-dose threshold shift", () => {
  it("reproduces the documented example", () =>
    expect(
      runTotalIonizingDoseThresholdShift(
        totalIonizingDoseThresholdShiftExample.input,
      ),
    ).toEqual({
      ok: true,
      output: totalIonizingDoseThresholdShiftExample.output,
    }));
  it("preserves the sign of the measured dose response", () =>
    expect(
      runTotalIonizingDoseThresholdShift({
        doseResponseMillivoltsPerKrad: -2,
        totalDoseKrad: 10,
      }),
    ).toEqual({ ok: true, output: { thresholdShiftMillivolts: -20 } }));
  it("returns zero at zero dose", () =>
    expect(
      runTotalIonizingDoseThresholdShift({
        doseResponseMillivoltsPerKrad: 2,
        totalDoseKrad: 0,
      }),
    ).toEqual({ ok: true, output: { thresholdShiftMillivolts: 0 } }));
});
