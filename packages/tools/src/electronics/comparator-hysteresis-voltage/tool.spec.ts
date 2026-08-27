import { describe, expect, it } from "vitest";
import {
  comparatorHysteresisVoltageExample,
  runComparatorHysteresisVoltage,
} from "./tool.js";

describe("Comparator Hysteresis Width", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runComparatorHysteresisVoltage(comparatorHysteresisVoltageExample.input),
    ).toEqual({
      ok: true,
      output: comparatorHysteresisVoltageExample.output,
    });
  });

  it("narrows the width when the feedback resistor increases", () => {
    expect(
      runComparatorHysteresisVoltage({
        feedbackResistorOhms: 200000,
        referenceResistorOhms: 25000,
        outputSwingVolts: 2,
      }),
    ).toEqual({
      ok: true,
      output: { hysteresisWidthV: 0.2222222222222222 },
    });
  });

  it("scales linearly with the reference voltage", () => {
    expect(
      runComparatorHysteresisVoltage({
        feedbackResistorOhms: 100000,
        referenceResistorOhms: 25000,
        outputSwingVolts: 1,
      }),
    ).toEqual({ ok: true, output: { hysteresisWidthV: 0.2 } });
  });

  it("handles fractional reference voltages", () => {
    expect(
      runComparatorHysteresisVoltage({
        feedbackResistorOhms: 60000,
        referenceResistorOhms: 12000,
        outputSwingVolts: 2.5,
      }),
    ).toEqual({ ok: true, output: { hysteresisWidthV: 0.41666666666666663 } });
  });

  it("rejects non-positive resistances", () => {
    expect(
      runComparatorHysteresisVoltage({
        feedbackResistorOhms: 100000,
        referenceResistorOhms: 0,
        outputSwingVolts: 2,
      }).ok,
    ).toBe(false);
  });

  it("rejects a non-positive output swing", () => {
    expect(
      runComparatorHysteresisVoltage({
        feedbackResistorOhms: 100000,
        referenceResistorOhms: 25000,
        outputSwingVolts: -2,
      }).ok,
    ).toBe(false);
  });

  it("requires all three inputs", () => {
    expect(
      runComparatorHysteresisVoltage({
        feedbackResistorOhms: 100000,
        outputSwingVolts: 2,
      }).ok,
    ).toBe(false);
  });
});
