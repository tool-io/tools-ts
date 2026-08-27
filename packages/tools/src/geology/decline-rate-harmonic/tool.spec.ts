import { describe, expect, it } from "vitest";
import { declineRateHarmonicExample, runDeclineRateHarmonic } from "./tool.js";

describe("decline-rate-harmonic", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDeclineRateHarmonic(declineRateHarmonicExample.input)).toEqual({
      ok: true,
      output: declineRateHarmonicExample.output,
    });
  });

  it("halves the rate when one over the decline rate has elapsed", () => {
    const result = runDeclineRateHarmonic({
      initialRateM3PerS: 0.02,
      initialDeclineRatePerS: 2e-8,
      elapsedSeconds: 5e7,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rateAfterElapsedM3PerS as number).toBe(0.01);
  });
  it("rejects non-positive initial rates", () => {
    expect(
      runDeclineRateHarmonic({
        initialRateM3PerS: -1,
        initialDeclineRatePerS: 2e-8,
        elapsedSeconds: 1000,
      }).ok,
    ).toBe(false);
  });
});
