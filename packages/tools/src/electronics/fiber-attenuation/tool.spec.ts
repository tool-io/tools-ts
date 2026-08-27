import { describe, expect, it } from "vitest";
import {
  calculateFiberAttenuation,
  fiberAttenuationExample,
  runFiberAttenuation,
} from "./tool.js";

describe("Fiber Attenuation dB", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runFiberAttenuation(fiberAttenuationExample.input)).toEqual({
      ok: true,
      output: fiberAttenuationExample.output,
    });
  });

  it("reports zero attenuation for a zero-length link", () => {
    expect(
      runFiberAttenuation({ attenuationDbPerKm: 0.2, lengthKm: 0 }),
    ).toEqual({ ok: true, output: { totalAttenuationDb: 0 } });
  });

  it("matches a standard 0.2 dB/km coefficient over 50 km", () => {
    expect(
      calculateFiberAttenuation({
        attenuationDbPerKm: 0.2,
        lengthKm: 50,
      }).totalAttenuationDb,
    ).toBe(10);
  });

  it("scales linearly with length", () => {
    expect(
      calculateFiberAttenuation({ attenuationDbPerKm: 3, lengthKm: 2 })
        .totalAttenuationDb,
    ).toBe(6);
  });

  it("rejects a negative coefficient via invalid_attenuation", () => {
    expect(
      runFiberAttenuation({ attenuationDbPerKm: -0.2, lengthKm: 10 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_attenuation", field: "attenuationDbPerKm" }],
      },
      ok: false,
    });
  });

  it("rejects negative length via invalid_length", () => {
    expect(
      runFiberAttenuation({ attenuationDbPerKm: 0.2, lengthKm: -1 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_length", field: "lengthKm" }] },
      ok: false,
    });
  });

  it("rejects missing required inputs", () => {
    expect(runFiberAttenuation({ lengthKm: 10 })).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "attenuationDbPerKm" }],
      },
      ok: false,
    });
  });

  it("accepts zero attenuation coefficient", () => {
    expect(
      runFiberAttenuation({ attenuationDbPerKm: 0, lengthKm: 100 }),
    ).toEqual({ ok: true, output: { totalAttenuationDb: 0 } });
  });
});
