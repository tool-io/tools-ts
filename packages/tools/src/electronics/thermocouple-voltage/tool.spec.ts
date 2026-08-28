import { describe, expect, it } from "vitest";
import {
  calculateThermocoupleVoltage,
  runThermocoupleVoltage,
  thermocoupleVoltageExample,
} from "./tool.js";

describe("Type K Thermocouple", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runThermocoupleVoltage(thermocoupleVoltageExample.input)).toEqual({
      ok: true,
      output: thermocoupleVoltageExample.output,
    });
  });

  it("defaults to the Type K sensitivity of 41 microvolts per degree", () => {
    expect(
      calculateThermocoupleVoltage({ temperatureDeltaC: 20 })
        .thermocoupleVoltageMv,
    ).toBe(0.82);
  });

  it("produces a signed voltage for negative temperature differences", () => {
    expect(runThermocoupleVoltage({ temperatureDeltaC: -50 })).toEqual({
      ok: true,
      output: { thermocoupleVoltageMv: -2.05 },
    });
  });

  it("scales linearly with the temperature difference", () => {
    const base = calculateThermocoupleVoltage({
      temperatureDeltaC: 30,
    }).thermocoupleVoltageMv;
    expect(
      calculateThermocoupleVoltage({ temperatureDeltaC: 90 })
        .thermocoupleVoltageMv,
    ).toBeCloseTo(base * 3, 12);
  });

  it("honors a custom Seebeck sensitivity", () => {
    expect(
      calculateThermocoupleVoltage({
        sensitivityUvPerC: 40.5,
        temperatureDeltaC: 37.5,
      }).thermocoupleVoltageMv,
    ).toBe(1.51875);
  });

  it("rejects non-positive sensitivity with a stable code", () => {
    expect(
      runThermocoupleVoltage({
        sensitivityUvPerC: 0,
        temperatureDeltaC: 10,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_sensitivity", field: "sensitivityUvPerC" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite temperature differences through execution", () => {
    expect(
      runThermocoupleVoltage({ temperatureDeltaC: Infinity } as never),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "temperatureDeltaC" }],
      },
      ok: false,
    });
  });

  it("rejects unknown input fields", () => {
    expect(
      runThermocoupleVoltage({
        ...thermocoupleVoltageExample.input,
        celsius: 5,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "celsius" }] },
      ok: false,
    });
  });
});
