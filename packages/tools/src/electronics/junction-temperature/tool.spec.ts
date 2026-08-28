import { describe, expect, it } from "vitest";
import { runJunctionTemperature, junctionTemperatureExample } from "./tool.js";

describe("Junction Temperature", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runJunctionTemperature(junctionTemperatureExample.input)).toEqual({
      ok: true,
      output: junctionTemperatureExample.output,
    }));
  it("equals ambient temperature at zero power", () =>
    expect(
      runJunctionTemperature({
        ambientTempC: 55,
        powerWatts: 0,
        thetaCPerW: 40,
      }),
    ).toEqual({ ok: true, output: { junctionTempC: 55 } }));
  it("adds the full rise for one watt", () =>
    expect(
      runJunctionTemperature({
        ambientTempC: 0,
        powerWatts: 1,
        thetaCPerW: 62.5,
      }),
    ).toEqual({ ok: true, output: { junctionTempC: 62.5 } }));
  it("supports sub-zero ambients", () =>
    expect(
      runJunctionTemperature({
        ambientTempC: -40,
        powerWatts: 0.75,
        thetaCPerW: 80,
      }),
    ).toEqual({ ok: true, output: { junctionTempC: 20 } }));
  it("rejects non-finite input", () =>
    expect(
      runJunctionTemperature({
        ambientTempC: Number.NaN,
        powerWatts: 1,
        thetaCPerW: 30,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ambientTempC" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runJunctionTemperature({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ambientTempC" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runJunctionTemperature({
        ...junctionTemperatureExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
