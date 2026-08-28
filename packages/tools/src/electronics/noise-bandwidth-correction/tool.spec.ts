import { describe, expect, it } from "vitest";
import {
  calculateNoiseBandwidthCorrection,
  noiseBandwidthCorrectionExample,
  runNoiseBandwidthCorrection,
} from "./tool.js";

describe("Brickwall Correction Factor", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNoiseBandwidthCorrection(noiseBandwidthCorrectionExample.input),
    ).toEqual({ ok: true, output: noiseBandwidthCorrectionExample.output });
  });

  it("defaults to the single-pole factor when the input is omitted", () => {
    expect(runNoiseBandwidthCorrection({})).toEqual({
      ok: true,
      output: { brickwallFactor: Math.PI / 2 },
    });
  });

  it("always returns pi over two", () => {
    expect(calculateNoiseBandwidthCorrection({}).brickwallFactor).toBe(
      Math.PI / 2,
    );
    expect(
      calculateNoiseBandwidthCorrection({
        rolloffEnum: "single-pole",
      }).brickwallFactor,
    ).toBe(1.5707963267948966);
  });

  it("exceeds one so the ENBW of a single-pole response is wider than its -3 dB bandwidth", () => {
    expect(
      calculateNoiseBandwidthCorrection({}).brickwallFactor,
    ).toBeGreaterThan(1);
  });

  it("rejects an unsupported rolloff value", () => {
    expect(
      runNoiseBandwidthCorrection({ rolloffEnum: "two-pole" as never }).ok,
    ).toBe(false);
  });

  it("rejects a non-string rolloff value", () => {
    expect(runNoiseBandwidthCorrection({ rolloffEnum: 42 as never }).ok).toBe(
      false,
    );
  });
});
