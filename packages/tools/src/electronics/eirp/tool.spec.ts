import { describe, expect, it } from "vitest";
import { eirpExample, runEirp } from "./tool.js";

describe("EIRP Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runEirp(eirpExample.input)).toEqual({
      ok: true,
      output: { eirpDbm: 32 },
    }));
  it("accepts signed negative antenna gains", () =>
    expect(
      runEirp({ cableLossDb: 3, txAntennaGainDb: -10, txPowerDbm: 20 }),
    ).toEqual({
      ok: true,
      output: { eirpDbm: 7 },
    }));
  it("adds the full transmitter power when cable loss is zero", () =>
    expect(
      runEirp({ cableLossDb: 0, txAntennaGainDb: 15, txPowerDbm: 20 }),
    ).toEqual({
      ok: true,
      output: { eirpDbm: 35 },
    }));
  it("rejects non-finite transmitter power", () =>
    expect(
      runEirp({
        cableLossDb: 3,
        txAntennaGainDb: 15,
        txPowerDbm: Number.NaN,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "txPowerDbm" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runEirp({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "txPowerDbm" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runEirp({ ...eirpExample.input, extra: true } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
