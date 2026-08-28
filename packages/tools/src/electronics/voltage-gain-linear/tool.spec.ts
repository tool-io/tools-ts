import { describe, expect, it } from "vitest";
import { runVoltageGainLinear, voltageGainLinearExample } from "./tool.js";

describe("Linear Voltage Gain", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runVoltageGainLinear(voltageGainLinearExample.input)).toEqual({
      ok: true,
      output: voltageGainLinearExample.output,
    }));
  it("reports unity gain for equal voltages", () =>
    expect(
      runVoltageGainLinear({ inputVoltageVolts: 3.3, outputVoltageVolts: 3.3 }),
    ).toEqual({
      ok: true,
      output: { voltageGain: 1 },
    }));
  it("reports fractional gain for an attenuator", () =>
    expect(
      runVoltageGainLinear({ inputVoltageVolts: 5, outputVoltageVolts: 0.5 }),
    ).toEqual({
      ok: true,
      output: { voltageGain: 0.1 },
    }));
  it("supports inverting stages through negative output", () =>
    expect(
      runVoltageGainLinear({ inputVoltageVolts: 1, outputVoltageVolts: -4 }),
    ).toEqual({
      ok: true,
      output: { voltageGain: -4 },
    }));
  it("rejects zero input voltage with a stable code", () =>
    expect(
      runVoltageGainLinear({ inputVoltageVolts: 0, outputVoltageVolts: 1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_voltage", field: "inputVoltageVolts" }],
      },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(
      runVoltageGainLinear({
        inputVoltageVolts: 1,
        outputVoltageVolts: Number.NaN,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "outputVoltageVolts" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runVoltageGainLinear({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "inputVoltageVolts" }],
      },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runVoltageGainLinear({
        ...voltageGainLinearExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
