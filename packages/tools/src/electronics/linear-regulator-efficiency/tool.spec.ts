import { describe, expect, it } from "vitest";
import {
  calculateLinearRegulatorEfficiency,
  linearRegulatorEfficiencyExample,
  runLinearRegulatorEfficiency,
} from "./tool.js";

describe("LDO Efficiency", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLinearRegulatorEfficiency(linearRegulatorEfficiencyExample.input),
    ).toEqual({
      ok: true,
      output: linearRegulatorEfficiencyExample.output,
    });
  });

  it("rejects output voltage above input voltage", () => {
    expect(
      runLinearRegulatorEfficiency({ inputVolts: 5, outputVolts: 12 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_output_volts" }] },
      ok: false,
    });
  });

  it("is one hundred percent for an equal-voltage regulator", () => {
    expect(
      calculateLinearRegulatorEfficiency({
        inputVolts: 12,
        outputVolts: 12,
      }).efficiencyPercent,
    ).toBe(100);
  });
});
