import { describe, expect, it } from "vitest";
import {
  selfHeatingTemperatureRiseExample,
  runSelfHeatingTemperatureRise,
} from "./tool.js";

describe("Self-Heating Temperature Rise Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runSelfHeatingTemperatureRise(selfHeatingTemperatureRiseExample.input),
    ).toEqual({ ok: true, output: selfHeatingTemperatureRiseExample.output }));

  it("returns zero rise for zero dissipated power", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: 0,
        thermalResistanceCPerW: 40,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 0 } }));

  it("scales linearly with power", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: 1.25,
        thermalResistanceCPerW: 40,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 50 } }));

  it("scales with fractional thermal resistance", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: 3,
        thermalResistanceCPerW: 12.5,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 37.5 } }));

  it("accepts sub-milliwatt power levels", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: 0.001,
        thermalResistanceCPerW: 1000,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 1 } }));

  it("rejects negative dissipated power", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: -1,
        thermalResistanceCPerW: 40,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "dissipatedPowerWatts" }],
      },
      ok: false,
    }));

  it("rejects zero thermal resistance", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: 1,
        thermalResistanceCPerW: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_value", field: "thermalResistanceCPerW" }],
      },
      ok: false,
    }));

  it("rejects non-finite thermal resistance", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: 1,
        thermalResistanceCPerW: Number.POSITIVE_INFINITY,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "thermalResistanceCPerW" }],
      },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: 1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "thermalResistanceCPerW" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runSelfHeatingTemperatureRise({
        dissipatedPowerWatts: 1,
        extra: 2,
        thermalResistanceCPerW: 40,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
