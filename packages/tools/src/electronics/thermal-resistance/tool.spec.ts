import { describe, expect, it } from "vitest";
import { runThermalResistance, thermalResistanceExample } from "./tool.js";

describe("Thermal Resistance °C/W", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runThermalResistance(thermalResistanceExample.input)).toEqual({
      ok: true,
      output: thermalResistanceExample.output,
    }));
  it("halves the resistance when power doubles at fixed rise", () =>
    expect(
      runThermalResistance({
        ...thermalResistanceExample.input,
        powerWatts: 4,
      }),
    ).toEqual({ ok: true, output: { thermalResistanceCPerW: 15 } }));
  it("returns zero resistance when temperatures match", () =>
    expect(
      runThermalResistance({
        ambientTempC: 40,
        junctionTempC: 40,
        powerWatts: 1.5,
      }),
    ).toEqual({ ok: true, output: { thermalResistanceCPerW: 0 } }));
  it("reports negative resistance for a junction below ambient", () =>
    expect(
      runThermalResistance({
        ambientTempC: 85,
        junctionTempC: 25,
        powerWatts: 3,
      }),
    ).toEqual({ ok: true, output: { thermalResistanceCPerW: -20 } }));
  it("accepts fractional power dissipation", () =>
    expect(
      runThermalResistance({
        ambientTempC: 0,
        junctionTempC: 1,
        powerWatts: 0.5,
      }),
    ).toEqual({ ok: true, output: { thermalResistanceCPerW: 2 } }));
  it("rejects zero power with a stable code", () =>
    expect(
      runThermalResistance({
        ...thermalResistanceExample.input,
        powerWatts: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "powerWatts" }] },
      ok: false,
    }));
  it("rejects negative power with a stable code", () =>
    expect(
      runThermalResistance({
        ...thermalResistanceExample.input,
        powerWatts: -2,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "powerWatts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runThermalResistance({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "junctionTempC" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runThermalResistance({
        ...thermalResistanceExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
