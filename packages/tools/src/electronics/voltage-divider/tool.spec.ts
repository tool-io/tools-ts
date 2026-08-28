import { describe, expect, it } from "vitest";
import {
  calculateVoltageDivider,
  runVoltageDivider,
  voltageDividerExample,
} from "./tool.js";

describe("voltage divider calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runVoltageDivider(voltageDividerExample.input)).toEqual({
      ok: true,
      output: voltageDividerExample.output,
    });
  });

  it("halves the input for equal resistors and approaches Vin as R2 grows", () => {
    expect(
      calculateVoltageDivider({
        inputVoltageV: 9,
        r1Ohms: 5000,
        r2Ohms: 5000,
      }).outputVoltageV,
    ).toBe(4.5);
    expect(
      calculateVoltageDivider({
        inputVoltageV: 9,
        r1Ohms: 1,
        r2Ohms: 999999999,
      }).outputVoltageV,
    ).toBeCloseTo(9, 6);
  });

  it("rejects non-positive resistances through execution", () => {
    expect(
      runVoltageDivider({
        inputVoltageV: 12,
        r1Ohms: 0,
        r2Ohms: 2000,
      }).ok,
    ).toBe(false);
    expect(runVoltageDivider(null).ok).toBe(false);
  });
});
