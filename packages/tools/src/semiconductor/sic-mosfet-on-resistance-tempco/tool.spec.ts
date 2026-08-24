import { describe, expect, it } from "vitest";
import {
  runSicMosfetOnResistanceTempco,
  sicMosfetOnResistanceTempcoExample,
} from "./tool.js";

describe("SiC MOSFET Rds Tempco Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSicMosfetOnResistanceTempco(sicMosfetOnResistanceTempcoExample.input),
    ).toEqual({ ok: true, output: sicMosfetOnResistanceTempcoExample.output });
  });

  it("returns the reference resistance at 25 degrees Celsius", () => {
    expect(
      runSicMosfetOnResistanceTempco({
        junctionTemperatureC: 25,
        rdsonAt25Ohms: 0.05,
        tempcoPercentPerC: 0.6,
      }),
    ).toEqual({ ok: true, output: { rdsonAtTempOhms: 0.05 } });
  });

  it("converts a percent-per-degree coefficient before applying it", () => {
    expect(
      runSicMosfetOnResistanceTempco({
        junctionTemperatureC: 75,
        rdsonAt25Ohms: 0.1,
        tempcoPercentPerC: 0.05,
      }),
    ).toEqual({ ok: true, output: { rdsonAtTempOhms: 0.1025 } });
  });

  it("supports a negative fitted coefficient when resistance stays positive", () => {
    expect(
      runSicMosfetOnResistanceTempco({
        junctionTemperatureC: 75,
        rdsonAt25Ohms: 0.1,
        tempcoPercentPerC: -0.1,
      }),
    ).toEqual({ ok: true, output: { rdsonAtTempOhms: 0.095 } });
  });

  it("rejects a zero reference resistance", () => {
    expect(
      runSicMosfetOnResistanceTempco({
        junctionTemperatureC: 125,
        rdsonAt25Ohms: 0,
        tempcoPercentPerC: 0.6,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_value", field: "rdsonAt25Ohms" }] },
      ok: false,
    });
  });

  it("rejects a coefficient and temperature that imply non-positive resistance", () => {
    expect(
      runSicMosfetOnResistanceTempco({
        junctionTemperatureC: 200,
        rdsonAt25Ohms: 0.05,
        tempcoPercentPerC: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_temperature_adjustment",
            field: "tempcoPercentPerC",
          },
        ],
      },
      ok: false,
    });
  });

  it("requires the device-specific coefficient", () => {
    expect(
      runSicMosfetOnResistanceTempco({
        junctionTemperatureC: 125,
        rdsonAt25Ohms: 0.05,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "tempcoPercentPerC" }],
      },
      ok: false,
    });
  });

  it("rejects non-finite values", () => {
    expect(
      runSicMosfetOnResistanceTempco({
        junctionTemperatureC: Number.POSITIVE_INFINITY,
        rdsonAt25Ohms: 0.05,
        tempcoPercentPerC: 0.6,
      }),
    ).toMatchObject({ ok: false });
  });
});
