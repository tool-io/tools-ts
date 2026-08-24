import { describe, expect, it } from "vitest";
import { calculateDibl, diblExample, runDibl } from "./tool.js";

describe("DIBL Coefficient Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDibl(diblExample.input)).toEqual({
      ok: true,
      output: diblExample.output,
    });
  });

  it("divides threshold-shift magnitude by drain-voltage change", () => {
    expect(
      calculateDibl({
        drainVoltageChangeV: 0.8,
        thresholdShiftMagnitudeMv: 40,
      }),
    ).toEqual({ diblCoefficientMVPerV: 50 });
  });

  it("allows zero measured shift", () => {
    expect(
      runDibl({ drainVoltageChangeV: 1, thresholdShiftMagnitudeMv: 0 }),
    ).toEqual({ ok: true, output: { diblCoefficientMVPerV: 0 } });
  });

  it("rejects non-positive voltage change and negative shift magnitude", () => {
    expect(
      runDibl({ drainVoltageChangeV: 0, thresholdShiftMagnitudeMv: 50 }).ok,
    ).toBe(false);
    expect(
      runDibl({ drainVoltageChangeV: 1, thresholdShiftMagnitudeMv: -1 }).ok,
    ).toBe(false);
  });
});
