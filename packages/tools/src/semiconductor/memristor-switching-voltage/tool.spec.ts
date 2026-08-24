import { describe, expect, it } from "vitest";
import {
  memristorSwitchingVoltageExample,
  runMemristorSwitchingVoltage,
} from "./tool.js";

describe("Memristor Switching Voltage Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMemristorSwitchingVoltage(memristorSwitchingVoltageExample.input),
    ).toEqual({ ok: true, output: memristorSwitchingVoltageExample.output });
  });

  it("needs one volt to apply 1 MV/cm across 10 nm", () => {
    expect(
      runMemristorSwitchingVoltage({
        oxideThicknessNm: 10,
        thresholdFieldMVPerCm: 1,
      }),
    ).toEqual({ ok: true, output: { switchingVolts: 1 } });
  });

  it("yields five volts for 10 MV/cm across 5 nm", () => {
    expect(
      runMemristorSwitchingVoltage({
        oxideThicknessNm: 5,
        thresholdFieldMVPerCm: 10,
      }),
    ).toEqual({ ok: true, output: { switchingVolts: 5 } });
  });

  it("doubles the voltage when thickness doubles", () => {
    expect(
      runMemristorSwitchingVoltage({
        oxideThicknessNm: 20,
        thresholdFieldMVPerCm: 1,
      }),
    ).toEqual({ ok: true, output: { switchingVolts: 2 } });
  });

  it("doubles the voltage when the field doubles", () => {
    expect(
      runMemristorSwitchingVoltage({
        oxideThicknessNm: 10,
        thresholdFieldMVPerCm: 2,
      }),
    ).toEqual({ ok: true, output: { switchingVolts: 2 } });
  });

  it("handles fractional fields and odd thicknesses", () => {
    expect(
      runMemristorSwitchingVoltage({
        oxideThicknessNm: 12,
        thresholdFieldMVPerCm: 3.5,
      }),
    ).toEqual({ ok: true, output: { switchingVolts: 4.2 } });
  });

  it("rejects a zero field", () => {
    expect(
      runMemristorSwitchingVoltage({
        oxideThicknessNm: 10,
        thresholdFieldMVPerCm: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects negative thickness through validation", () => {
    expect(
      runMemristorSwitchingVoltage({
        oxideThicknessNm: -5,
        thresholdFieldMVPerCm: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });

  it("rejects non-finite thickness", () => {
    expect(
      runMemristorSwitchingVoltage({
        oxideThicknessNm: Number.NaN,
        thresholdFieldMVPerCm: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing inputs", () => {
    expect(runMemristorSwitchingVoltage({}).ok).toBe(false);
  });
});
