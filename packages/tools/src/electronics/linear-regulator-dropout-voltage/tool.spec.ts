import { describe, expect, it } from "vitest";
import {
  calculateLinearRegulatorDropoutVoltage,
  linearRegulatorDropoutVoltageExample,
  runLinearRegulatorDropoutVoltage,
} from "./tool.js";

describe("LDO Dropout Headroom", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLinearRegulatorDropoutVoltage(
        linearRegulatorDropoutVoltageExample.input,
      ),
    ).toEqual({
      ok: true,
      output: linearRegulatorDropoutVoltageExample.output,
    });
  });

  it("matches the subtraction formula on another operating point", () => {
    expect(
      calculateLinearRegulatorDropoutVoltage({
        dropoutVolts: 0.3,
        inputVolts: 5,
        outputVolts: 3.3,
      }).dropoutHeadroomV,
    ).toBe(5 - (3.3 + 0.3));
  });

  it("returns a negative headroom when regulation cannot be maintained", () => {
    expect(
      runLinearRegulatorDropoutVoltage({
        dropoutVolts: 1.2,
        inputVolts: 3,
        outputVolts: 3.3,
      }),
    ).toEqual({ ok: true, output: { dropoutHeadroomV: -1.5 } });
  });

  it("returns zero headroom at the exact dropout boundary", () => {
    expect(
      calculateLinearRegulatorDropoutVoltage({
        dropoutVolts: 0.5,
        inputVolts: 2.5,
        outputVolts: 2,
      }).dropoutHeadroomV,
    ).toBe(0);
  });

  it("scales one-to-one with input voltage", () => {
    expect(
      calculateLinearRegulatorDropoutVoltage({
        ...linearRegulatorDropoutVoltageExample.input,
        inputVolts: 15,
      }).dropoutHeadroomV,
    ).toBe(8.8);
  });

  it("rejects non-positive voltages", () => {
    expect(
      runLinearRegulatorDropoutVoltage({
        ...linearRegulatorDropoutVoltageExample.input,
        inputVolts: 0,
      }).ok,
    ).toBe(false);
    expect(
      runLinearRegulatorDropoutVoltage({
        ...linearRegulatorDropoutVoltageExample.input,
        outputVolts: -1,
      }).ok,
    ).toBe(false);
    expect(
      runLinearRegulatorDropoutVoltage({
        ...linearRegulatorDropoutVoltageExample.input,
        dropoutVolts: 0,
      }).ok,
    ).toBe(false);
  });
});
