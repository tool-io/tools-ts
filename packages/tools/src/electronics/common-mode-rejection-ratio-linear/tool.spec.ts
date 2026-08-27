import { describe, expect, it } from "vitest";
import { runCommonModeRejectionRatioLinear } from "./tool.js";

describe("CMRR Linear", () => {
  it("calculates a valid result", () =>
    expect(
      runCommonModeRejectionRatioLinear({
        differentialGain: 100000,
        commonModeGain: 10,
      }),
    ).toEqual({
      ok: true,
      output: { cmrrLinear: 10000 },
    }));
  it("returns unity for equal gains", () =>
    expect(
      runCommonModeRejectionRatioLinear({
        differentialGain: 40,
        commonModeGain: 40,
      }),
    ).toEqual({
      ok: true,
      output: { cmrrLinear: 1 },
    }));
  it("keeps the sign of a negative common-mode gain", () =>
    expect(
      runCommonModeRejectionRatioLinear({
        differentialGain: 100,
        commonModeGain: -4,
      }),
    ).toEqual({
      ok: true,
      output: { cmrrLinear: -25 },
    }));
  it("supports fractional ratios", () =>
    expect(
      runCommonModeRejectionRatioLinear({
        differentialGain: 1,
        commonModeGain: 8,
      }),
    ).toEqual({
      ok: true,
      output: { cmrrLinear: 0.125 },
    }));
  it("rejects zero common-mode gain", () => {
    const result = runCommonModeRejectionRatioLinear({
      differentialGain: 100,
      commonModeGain: 0,
    });
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.issues[0]?.code).toBe("degenerate_input");
  });
});
