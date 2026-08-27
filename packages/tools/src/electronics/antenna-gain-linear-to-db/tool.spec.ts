import { describe, expect, it } from "vitest";
import {
  antennaGainLinearToDbExample,
  runAntennaGainLinearToDb,
} from "./tool.js";

describe("Linear Gain To dB", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runAntennaGainLinearToDb(antennaGainLinearToDbExample.input),
    ).toEqual({
      ok: true,
      output: { antennaGainDb: 20 },
    }));
  it("reports 0 dB for unity ratio", () =>
    expect(runAntennaGainLinearToDb({ linearRatio: 1 })).toEqual({
      ok: true,
      output: { antennaGainDb: 0 },
    }));
  it("reports fractional ratio for attenuation", () =>
    expect(runAntennaGainLinearToDb({ linearRatio: 0.5 })).toEqual({
      ok: true,
      output: { antennaGainDb: -3.010299956639812 },
    }));
  it("rejects zero ratio", () =>
    expect(runAntennaGainLinearToDb({ linearRatio: 0 }).ok).toBe(false));
  it("rejects negative ratio", () =>
    expect(runAntennaGainLinearToDb({ linearRatio: -10 }).ok).toBe(false));
  it("rejects non-finite input", () =>
    expect(
      runAntennaGainLinearToDb({ linearRatio: Number.POSITIVE_INFINITY }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "linearRatio" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runAntennaGainLinearToDb({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "linearRatio" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runAntennaGainLinearToDb({
        ...antennaGainLinearToDbExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
