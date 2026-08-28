import { describe, expect, it } from "vitest";
import {
  calculateVoltageRegulatorPowerDissipation,
  runVoltageRegulatorPowerDissipation,
  voltageRegulatorPowerDissipationExample,
} from "./tool.js";

describe("Regulator Dissipation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runVoltageRegulatorPowerDissipation(
        voltageRegulatorPowerDissipationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: voltageRegulatorPowerDissipationExample.output,
    });
  });

  it("rejects output voltage above input voltage", () => {
    expect(
      runVoltageRegulatorPowerDissipation({
        inputVolts: 5,
        loadCurrentA: 1,
        outputVolts: 12,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "negative_differential" }] },
      ok: false,
    });
  });

  it("allows an equal-input-output regulator with zero dissipation", () => {
    expect(
      calculateVoltageRegulatorPowerDissipation({
        inputVolts: 5,
        loadCurrentA: 1,
        outputVolts: 5,
      }).powerDissipationWatts,
    ).toBe(0);
  });
});
