import { describe, expect, it } from "vitest";
import { rippleCurrentBuckExample, runRippleCurrentBuck } from "./tool.js";
describe("Buck Ripple Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRippleCurrentBuck(rippleCurrentBuckExample.input)).toEqual({
      ok: true,
      output: rippleCurrentBuckExample.output,
    });
  });
  it("computes ripple from vin, vout, duty, inductance and frequency", () => {
    expect(
      runRippleCurrentBuck({
        dutyFraction: 0.25,
        inductanceUh: 50,
        switchingFreqKhz: 100,
        vin: 24,
        vout: 4,
      }),
    ).toEqual({ ok: true, output: { rippleCurrentA: 1 } });
  });
  it("rejects invalid input", () => {
    expect(
      runRippleCurrentBuck({
        dutyFraction: 1.5,
        inductanceUh: 50,
        switchingFreqKhz: 100,
        vin: 24,
        vout: 4,
      }).ok,
    ).toBe(false);
  });
});
