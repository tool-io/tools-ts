import { describe, expect, it } from "vitest";
import { modulatorVpiLExample, runModulatorVpiL } from "./tool.js";

describe("Modulator V·pi L Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runModulatorVpiL(modulatorVpiLExample.input)).toEqual({
      ok: true,
      output: { voltageLengthProductVMm: 20 },
    }));

  it("scales linearly with interaction length", () =>
    expect(
      runModulatorVpiL({
        ...modulatorVpiLExample.input,
        interactionLengthMm: 20,
        piSwitchVoltageVolts: 3,
      }),
    ).toEqual({ ok: true, output: { voltageLengthProductVMm: 60 } }));

  it("accepts fractional switching voltages", () =>
    expect(
      runModulatorVpiL({
        interactionLengthMm: 12,
        piSwitchVoltageVolts: 0.5,
      }),
    ).toEqual({ ok: true, output: { voltageLengthProductVMm: 6 } }));

  it("rejects zero switching voltage with a stable code", () =>
    expect(
      runModulatorVpiL({
        ...modulatorVpiLExample.input,
        piSwitchVoltageVolts: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "piSwitchVoltageVolts" }],
      },
      ok: false,
    }));

  it("rejects negative switching voltage with a stable code", () =>
    expect(
      runModulatorVpiL({
        ...modulatorVpiLExample.input,
        piSwitchVoltageVolts: -2,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "piSwitchVoltageVolts" }],
      },
      ok: false,
    }));

  it("rejects zero interaction length with a stable code", () =>
    expect(
      runModulatorVpiL({
        ...modulatorVpiLExample.input,
        interactionLengthMm: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "interactionLengthMm" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runModulatorVpiL({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "interactionLengthMm" }],
      },
      ok: false,
    }));
});
