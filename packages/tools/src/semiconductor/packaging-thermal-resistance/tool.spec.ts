import { describe, expect, it } from "vitest";
import {
  packagingThermalResistanceExample,
  runPackagingThermalResistance,
} from "./tool.js";

describe("Package Thermal Resistance Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runPackagingThermalResistance(packagingThermalResistanceExample.input),
    ).toEqual({ ok: true, output: packagingThermalResistanceExample.output }));

  it("halves the resistance when power doubles at fixed rise", () =>
    expect(
      runPackagingThermalResistance({
        ...packagingThermalResistanceExample.input,
        powerWatts: 4,
      }),
    ).toEqual({ ok: true, output: { thermalResistanceCPerW: 15 } }));

  it("rejects zero temperature rise", () =>
    expect(
      runPackagingThermalResistance({
        ambientTemperatureC: 40,
        junctionTemperatureC: 40,
        powerWatts: 1.5,
      }),
    ).toMatchObject({ ok: false }));

  it("rejects a junction below ambient", () =>
    expect(
      runPackagingThermalResistance({
        ambientTemperatureC: 85,
        junctionTemperatureC: 25,
        powerWatts: 3,
      }),
    ).toMatchObject({ ok: false }));

  it("accepts fractional power dissipation", () =>
    expect(
      runPackagingThermalResistance({
        ambientTemperatureC: 0,
        junctionTemperatureC: 1,
        powerWatts: 0.5,
      }),
    ).toEqual({ ok: true, output: { thermalResistanceCPerW: 2 } }));

  it("rejects zero power with a stable code", () =>
    expect(
      runPackagingThermalResistance({
        ...packagingThermalResistanceExample.input,
        powerWatts: 0,
      }),
    ).toMatchObject({ ok: false }));

  it("rejects negative power with a stable code", () =>
    expect(
      runPackagingThermalResistance({
        ...packagingThermalResistanceExample.input,
        powerWatts: -2,
      }),
    ).toMatchObject({ ok: false }));

  it("rejects non-finite temperatures", () =>
    expect(
      runPackagingThermalResistance({
        ...packagingThermalResistanceExample.input,
        junctionTemperatureC: Number.POSITIVE_INFINITY,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "junctionTemperatureC" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runPackagingThermalResistance({})).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "junctionTemperatureC" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runPackagingThermalResistance({
        ...packagingThermalResistanceExample.input,
        extra: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
