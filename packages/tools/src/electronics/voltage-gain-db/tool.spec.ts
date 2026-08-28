import { describe, expect, it } from "vitest";
import { runVoltageGainDb, voltageGainDbExample } from "./tool.js";

describe("Voltage Gain dB", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runVoltageGainDb(voltageGainDbExample.input)).toEqual({
      ok: true,
      output: voltageGainDbExample.output,
    }));
  it("reports zero dB for unity gain", () =>
    expect(
      runVoltageGainDb({ inputVoltageVolts: 2.5, outputVoltageVolts: 2.5 }),
    ).toEqual({
      ok: true,
      output: { gainDb: 0 },
    }));
  it("reports negative dB for attenuation", () =>
    expect(
      runVoltageGainDb({ inputVoltageVolts: 10, outputVoltageVolts: 1 }),
    ).toEqual({
      ok: true,
      output: { gainDb: -20 },
    }));
  it("converts a factor-of-root-two attenuation to -3 dB", () =>
    expect(
      runVoltageGainDb({
        inputVoltageVolts: Math.SQRT2,
        outputVoltageVolts: 1,
      }),
    ).toEqual({
      ok: true,
      output: { gainDb: -3.0102999566398125 },
    }));
  it("rejects zero input voltage with a stable code", () =>
    expect(
      runVoltageGainDb({ inputVoltageVolts: 0, outputVoltageVolts: 1 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_voltage", field: "inputVoltageVolts" }],
      },
      ok: false,
    }));
  it("rejects negative output voltage with a stable code", () =>
    expect(
      runVoltageGainDb({ inputVoltageVolts: 1, outputVoltageVolts: -2 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_voltage", field: "outputVoltageVolts" }],
      },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(
      runVoltageGainDb({
        inputVoltageVolts: Number.NaN,
        outputVoltageVolts: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "inputVoltageVolts" }],
      },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runVoltageGainDb({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "inputVoltageVolts" }],
      },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runVoltageGainDb({ ...voltageGainDbExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
