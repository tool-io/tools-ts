import { describe, expect, it } from "vitest";
import {
  autocorrExample as example,
  autocorrToPulse,
  runAutocorr,
} from "./tool.js";

describe("autocorrelator deconvolution", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runAutocorr(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("applies the 1.543 sech² factor", () => {
    const out = autocorrToPulse({
      autocorrWidthFs: 154.3,
      pulseShape: "sech-squared",
    });
    expect(out.pulseWidthFs).toBeCloseTo(100, 9);
    expect(out.deconvolutionFactor).toBe(1.543);
  });
  it("round-trips pulse width through the factor", () => {
    const pulse = 87.5;
    const ac = pulse * Math.SQRT2;
    expect(
      autocorrToPulse({ autocorrWidthFs: ac, pulseShape: "gaussian" })
        .pulseWidthFs,
    ).toBeCloseTo(pulse, 12);
  });
  it("rejects non-positive widths", () =>
    expect(runAutocorr({ autocorrWidthFs: 0, pulseShape: "gaussian" }).ok).toBe(
      false,
    ));
});
