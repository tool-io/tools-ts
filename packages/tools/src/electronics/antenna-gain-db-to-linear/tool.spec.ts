import { describe, expect, it } from "vitest";
import {
  antennaGainDbToLinearExample,
  runAntennaGainDbToLinear,
} from "./tool.js";

describe("Gain dB To Linear", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runAntennaGainDbToLinear(antennaGainDbToLinearExample.input),
    ).toEqual({
      ok: true,
      output: { powerGainLinear: 1000 },
    }));
  it("reports unity power gain for 0 dB", () =>
    expect(runAntennaGainDbToLinear({ gainDb: 0 })).toEqual({
      ok: true,
      output: { powerGainLinear: 1 },
    }));
  it("reports fractional gain for negative decibels", () =>
    expect(runAntennaGainDbToLinear({ gainDb: -3 })).toEqual({
      ok: true,
      output: { powerGainLinear: 0.5011872336272722 },
    }));
  it("reports large gains without sign restrictions", () =>
    expect(runAntennaGainDbToLinear({ gainDb: 60 })).toEqual({
      ok: true,
      output: { powerGainLinear: 1000000 },
    }));
  it("rejects non-finite input", () =>
    expect(runAntennaGainDbToLinear({ gainDb: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "gainDb" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runAntennaGainDbToLinear({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "gainDb" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runAntennaGainDbToLinear({
        ...antennaGainDbToLinearExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
