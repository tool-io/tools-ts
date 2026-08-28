import { describe, expect, it } from "vitest";
import {
  runResistorJohnsonNoise,
  resistorJohnsonNoiseExample,
} from "./tool.js";

describe("Johnson Noise", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runResistorJohnsonNoise(resistorJohnsonNoiseExample.input)).toEqual({
      ok: true,
      output: resistorJohnsonNoiseExample.output,
    }));
  it("scales with the square root of bandwidth", () =>
    expect(
      runResistorJohnsonNoise({
        ...resistorJohnsonNoiseExample.input,
        bandwidthHz: 4000000,
      }),
    ).toEqual({ ok: true, output: { noiseVoltageNv: 1789.7222354320795 } }));
  it("doubles when resistance quadruples at fixed bandwidth", () =>
    expect(
      runResistorJohnsonNoise({
        ...resistorJohnsonNoiseExample.input,
        resistanceOhms: 200,
      }),
    ).toEqual({ ok: true, output: { noiseVoltageNv: 1789.7222354320795 } }));
  it("computes audio-band noise for a one-kilohm resistor", () =>
    expect(
      runResistorJohnsonNoise({
        bandwidthHz: 10000,
        resistanceOhms: 1000,
        temperatureK: 300,
      }),
    ).toEqual({ ok: true, output: { noiseVoltageNv: 407.03547756921625 } }));
  it("rejects zero temperature with a stable code", () =>
    expect(
      runResistorJohnsonNoise({
        ...resistorJohnsonNoiseExample.input,
        temperatureK: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_temperature", field: "temperatureK" }],
      },
      ok: false,
    }));
  it("rejects negative resistance with a stable code", () =>
    expect(
      runResistorJohnsonNoise({
        ...resistorJohnsonNoiseExample.input,
        resistanceOhms: -50,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_resistance", field: "resistanceOhms" }],
      },
      ok: false,
    }));
  it("rejects zero bandwidth with a stable code", () =>
    expect(
      runResistorJohnsonNoise({
        ...resistorJohnsonNoiseExample.input,
        bandwidthHz: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_bandwidth", field: "bandwidthHz" }] },
      ok: false,
    }));
  it("rejects missing required inputs", () =>
    expect(runResistorJohnsonNoise({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "temperatureK" }] },
      ok: false,
    }));
  it("rejects unknown input fields", () =>
    expect(
      runResistorJohnsonNoise({
        ...resistorJohnsonNoiseExample.input,
        extra: true,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));
});
