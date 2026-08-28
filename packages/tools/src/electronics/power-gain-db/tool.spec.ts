import { describe, expect, it } from "vitest";
import { runPowerGainDb, powerGainDbExample } from "./tool.js";

describe("Power Gain dB", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runPowerGainDb(powerGainDbExample.input)).toEqual({
      ok: true,
      output: powerGainDbExample.output,
    }));
  it("reports zero dB for unity gain", () =>
    expect(runPowerGainDb({ inputPowerWatts: 4, outputPowerWatts: 4 })).toEqual(
      {
        ok: true,
        output: { gainDb: 0 },
      },
    ));
  it("reports negative dB for attenuation", () =>
    expect(
      runPowerGainDb({ inputPowerWatts: 10, outputPowerWatts: 1 }),
    ).toEqual({
      ok: true,
      output: { gainDb: -10 },
    }));
  it("reports three dB for a doubled power", () =>
    expect(
      runPowerGainDb({ inputPowerWatts: 1, outputPowerWatts: Math.SQRT2 }),
    ).toEqual({ ok: true, output: { gainDb: 1.505149978319906 } }));
  it("rejects zero input power with a stable code", () =>
    expect(
      runPowerGainDb({ inputPowerWatts: 0, outputPowerWatts: 1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "inputPowerWatts" }] },
      ok: false,
    }));
  it("rejects negative output power with a stable code", () =>
    expect(
      runPowerGainDb({ inputPowerWatts: 1, outputPowerWatts: -2 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_power", field: "outputPowerWatts" }] },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(
      runPowerGainDb({
        inputPowerWatts: Number.POSITIVE_INFINITY,
        outputPowerWatts: 1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "inputPowerWatts" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runPowerGainDb({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "inputPowerWatts" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runPowerGainDb({ ...powerGainDbExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
