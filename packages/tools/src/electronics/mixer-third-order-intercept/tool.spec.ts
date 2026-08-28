import { describe, expect, it } from "vitest";
import {
  calculateMixerThirdOrderIntercept,
  mixerThirdOrderInterceptExample,
  runMixerThirdOrderIntercept,
} from "./tool.js";

describe("Mixer IP3", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMixerThirdOrderIntercept(mixerThirdOrderInterceptExample.input),
    ).toEqual({
      ok: true,
      output: mixerThirdOrderInterceptExample.output,
    });
  });

  it("places the intercept halfway above the tone for 30 dB of suppression", () => {
    expect(
      calculateMixerThirdOrderIntercept({
        imProductDbm: -40,
        inputDbm: -10,
      }).outputIp3Dbm,
    ).toBe(5);
  });

  it("matches a textbook 2:1 slope extrapolation", () => {
    const ip3 = calculateMixerThirdOrderIntercept({
      imProductDbm: -55,
      inputDbm: -20,
    }).outputIp3Dbm;
    expect(ip3).toBe(-2.5);
  });

  it("reports the tone level itself when IM3 equals the tones", () => {
    expect(
      runMixerThirdOrderIntercept({ imProductDbm: 0, inputDbm: 0 }),
    ).toEqual({ ok: true, output: { outputIp3Dbm: 0 } });
  });

  it("handles fractional dBm levels", () => {
    const ip3 = calculateMixerThirdOrderIntercept({
      imProductDbm: -33.5,
      inputDbm: -7.25,
    }).outputIp3Dbm;
    expect(ip3).toBe(-7.25 + (-7.25 - -33.5) / 2);
  });

  it("rejects a non-finite tone level via invalid_field", () => {
    expect(
      runMixerThirdOrderIntercept({
        imProductDbm: -40,
        inputDbm: Number.POSITIVE_INFINITY,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "inputDbm" }] },
      ok: false,
    });
  });

  it("rejects a non-finite product level via invalid_field", () => {
    expect(() =>
      calculateMixerThirdOrderIntercept({
        imProductDbm: Number.NaN,
        inputDbm: -10,
      }),
    ).toThrow();
  });

  it("rejects missing required inputs", () => {
    expect(runMixerThirdOrderIntercept({ inputDbm: -10 })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "imProductDbm" }] },
      ok: false,
    });
  });
});
