import { describe, expect, it } from "vitest";
import { runPwmResolution } from "./tool.js";
describe("PWM Resolution Bits", () => {
  it("calculates an integer resolution for a power-of-two ratio", () =>
    expect(runPwmResolution({ clockHz: 16384, pwmFrequencyHz: 1 })).toEqual({
      ok: true,
      output: { pwmResolutionBits: 14 },
    }));
  it("calculates a fractional resolution", () =>
    expect(
      runPwmResolution({ clockHz: 10000000, pwmFrequencyHz: 1000 }),
    ).toEqual({
      ok: true,
      output: { pwmResolutionBits: 13.287712379549449 },
    }));
  it("accepts equal-to-one-bit ratios", () =>
    expect(runPwmResolution({ clockHz: 2000, pwmFrequencyHz: 1000 })).toEqual({
      ok: true,
      output: { pwmResolutionBits: 1 },
    }));
  it("rejects a clock not faster than the PWM frequency", () => {
    const result = runPwmResolution({ clockHz: 1000, pwmFrequencyHz: 1000 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("clock_too_slow");
  });
  it("rejects a PWM frequency above the clock", () =>
    expect(runPwmResolution({ clockHz: 500, pwmFrequencyHz: 1000 }).ok).toBe(
      false,
    ));
  it("rejects a non-positive clock", () =>
    expect(runPwmResolution({ clockHz: 0, pwmFrequencyHz: 100 }).ok).toBe(
      false,
    ));
  it("rejects a non-positive PWM frequency", () =>
    expect(runPwmResolution({ clockHz: 1e6, pwmFrequencyHz: -1 }).ok).toBe(
      false,
    ));
});
