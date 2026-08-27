import { describe, expect, it } from "vitest";
import {
  attenuatorVoltageExample,
  calculateAttenuatorVoltage,
  runAttenuatorVoltage,
} from "./tool.js";

describe("Voltage Attenuator Ratio", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runAttenuatorVoltage(attenuatorVoltageExample.input)).toEqual({
      ok: true,
      output: attenuatorVoltageExample.output,
    });
  });

  it("reports unity for a straight-through connection", () => {
    expect(runAttenuatorVoltage({ vIn: 3.3, vOut: 3.3 })).toEqual({
      ok: true,
      output: { voltageAttenuationLinear: 1 },
    });
  });

  it("matches a classic two-to-one divider ratio", () => {
    expect(
      calculateAttenuatorVoltage({ vIn: 10, vOut: 5 }).voltageAttenuationLinear,
    ).toBe(0.5);
  });

  it("keeps the sign for inverted or negative outputs", () => {
    expect(runAttenuatorVoltage({ vIn: 4, vOut: -1 })).toEqual({
      ok: true,
      output: { voltageAttenuationLinear: -0.25 },
    });
  });

  it("shrinks toward zero as attenuation deepens", () => {
    const mild = calculateAttenuatorVoltage({
      vIn: 8,
      vOut: 2,
    }).voltageAttenuationLinear;
    const deep = calculateAttenuatorVoltage({
      vIn: 80,
      vOut: 2,
    }).voltageAttenuationLinear;
    expect(deep).toBeLessThan(mild);
    expect(deep).toBeGreaterThan(0);
  });

  it("rejects zero input voltage via must_be_nonzero", () => {
    expect(runAttenuatorVoltage({ vIn: 0, vOut: 1 })).toMatchObject({
      error: { issues: [{ code: "must_be_nonzero", field: "vIn" }] },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runAttenuatorVoltage({
        ...attenuatorVoltageExample.input,
        vin: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "vin" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runAttenuatorVoltage({ vOut: 1 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "vIn" }] },
      ok: false,
    });
  });
});
