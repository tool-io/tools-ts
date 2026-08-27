import { describe, expect, it } from "vitest";
import {
  declineRateExponentialExample,
  runDeclineRateExponential,
} from "./tool.js";

describe("decline-rate-exponential", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDeclineRateExponential(declineRateExponentialExample.input),
    ).toEqual({
      ok: true,
      output: declineRateExponentialExample.output,
    });
  });

  it("keeps the rate unchanged after no time has passed", () => {
    const result = runDeclineRateExponential({
      initialRateM3PerS: 0.02,
      declineRatePerS: 2e-8,
      elapsedSeconds: Number.MIN_VALUE,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.rateAfterElapsedM3PerS as number).toBeCloseTo(
      0.02,
      12,
    );
  });
  it("rejects non-positive decline rates", () => {
    expect(
      runDeclineRateExponential({
        initialRateM3PerS: 0.02,
        declineRatePerS: 0,
        elapsedSeconds: 1000,
      }).ok,
    ).toBe(false);
  });
});
