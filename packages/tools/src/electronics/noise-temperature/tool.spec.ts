import { describe, expect, it } from "vitest";
import { noiseTemperatureExample, runNoiseTemperature } from "./tool.js";

describe("Noise Temperature", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runNoiseTemperature(noiseTemperatureExample.input)).toEqual({
      ok: true,
      output: { equivalentNoiseTemperatureK: 290 },
    }));
  it("reports 0 K for a unity noise factor", () =>
    expect(runNoiseTemperature({ noiseFactor: 1 })).toEqual({
      ok: true,
      output: { equivalentNoiseTemperatureK: 0 },
    }));
  it("scales linearly with excess noise factor", () =>
    expect(runNoiseTemperature({ noiseFactor: 3 })).toEqual({
      ok: true,
      output: { equivalentNoiseTemperatureK: 580 },
    }));
  it("reports typical low-noise amplifier temperatures", () =>
    expect(runNoiseTemperature({ noiseFactor: 16 })).toEqual({
      ok: true,
      output: { equivalentNoiseTemperatureK: 4350 },
    }));
  it("guards below-unity factors with a dedicated code", () =>
    expect(runNoiseTemperature({ noiseFactor: 0.5 })).toMatchObject({
      error: {
        issues: [{ code: "below_unity", field: "noiseFactor" }],
      },
      ok: false,
    }));
  it("rejects non-finite input", () =>
    expect(runNoiseTemperature({ noiseFactor: Number.NaN })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "noiseFactor" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runNoiseTemperature({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "noiseFactor" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runNoiseTemperature({
        ...noiseTemperatureExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
