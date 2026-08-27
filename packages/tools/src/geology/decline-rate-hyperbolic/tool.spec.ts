import { describe, expect, it } from "vitest";
import {
  declineRateHyperbolicExample,
  runDeclineRateHyperbolic,
} from "./tool.js";

describe("decline-rate-hyperbolic", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDeclineRateHyperbolic(declineRateHyperbolicExample.input),
    ).toEqual({
      ok: true,
      output: declineRateHyperbolicExample.output,
    });
  });

  it("declines more slowly than the exponential case for the same initial decline", () => {
    const result = runDeclineRateHyperbolic({
      initialRateM3PerS: 0.02,
      initialDeclineRatePerS: 2e-8,
      declineExponent: 0.5,
      elapsedSeconds: 31_536_000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rateAfterElapsedM3PerS as number).toBeGreaterThan(
      0.010644169458496831,
    );
  });
  it("rejects a unit or larger decline exponent", () => {
    expect(
      runDeclineRateHyperbolic({
        initialRateM3PerS: 0.02,
        initialDeclineRatePerS: 2e-8,
        declineExponent: 1,
        elapsedSeconds: 1000,
      }).ok,
    ).toBe(false);
  });
});
