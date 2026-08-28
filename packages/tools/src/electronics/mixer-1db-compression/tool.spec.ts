import { describe, expect, it } from "vitest";
import {
  calculateMixer1dbCompression,
  mixer1dbCompressionExample,
  runMixer1dbCompression,
} from "./tool.js";
import { calculateMixerThirdOrderIntercept } from "../mixer-third-order-intercept/tool.js";

describe("Mixer P1dB Rule", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMixer1dbCompression(mixer1dbCompressionExample.input)).toEqual({
      ok: true,
      output: mixer1dbCompressionExample.output,
    });
  });

  it("applies the documented 10.5 dB offset to a high-IP3 mixer", () => {
    expect(runMixer1dbCompression({ ip3Dbm: 25 })).toEqual({
      ok: true,
      output: { mixerP1dbDbm: 14.5 },
    });
  });

  it("applies the same offset to a negative IP3", () => {
    expect(calculateMixer1dbCompression({ ip3Dbm: -3.2 }).mixerP1dbDbm).toBe(
      -13.7,
    );
  });

  it("shifts one-for-one with the intercept", () => {
    const a = calculateMixer1dbCompression({ ip3Dbm: 0 }).mixerP1dbDbm;
    const b = calculateMixer1dbCompression({ ip3Dbm: 8 }).mixerP1dbDbm;
    expect(b).toBe(a + 8);
  });

  it("chains with the IP3 extrapolation rule", () => {
    const ip3 = calculateMixerThirdOrderIntercept({
      imProductDbm: -40,
      inputDbm: -10,
    }).outputIp3Dbm;
    expect(calculateMixer1dbCompression({ ip3Dbm: ip3 }).mixerP1dbDbm).toBe(
      -5.5,
    );
  });

  it("rejects non-finite IP3 via invalid_field", () => {
    expect(
      runMixer1dbCompression({ ip3Dbm: Number.NEGATIVE_INFINITY }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ip3Dbm" }] },
      ok: false,
    });
  });

  it("rejects NaN IP3 in direct calculation", () => {
    expect(() =>
      calculateMixer1dbCompression({ ip3Dbm: Number.NaN }),
    ).toThrow();
  });

  it("rejects missing required inputs", () => {
    expect(runMixer1dbCompression({})).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "ip3Dbm" }] },
      ok: false,
    });
  });
});
