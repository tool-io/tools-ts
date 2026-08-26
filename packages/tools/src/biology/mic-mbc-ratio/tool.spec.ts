import { describe, expect, it } from "vitest";
import { runMicMbcRatio } from "./tool.js";

describe("MIC/MBC Ratio", () => {
  it("calculates a valid result", () =>
    expect(runMicMbcRatio({ mbcMgPerL: 8, micMgPerL: 2 })).toEqual({
      ok: true,
      output: { mbcMicRatio: 4 },
    }));
  it("returns one when MBC equals MIC", () => {
    const result = runMicMbcRatio({ mbcMgPerL: 4, micMgPerL: 4 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.mbcMicRatio).toBe(1);
  });
  it("flags bactericidal activity up to four", () => {
    const result = runMicMbcRatio({ mbcMgPerL: 6, micMgPerL: 3 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.mbcMicRatio).toBe(2);
  });
  it("reports fractional ratios", () => {
    const result = runMicMbcRatio({ mbcMgPerL: 3, micMgPerL: 2 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.mbcMicRatio).toBe(1.5);
  });
  it("rejects an MBC below the MIC as an invalid ratio", () => {
    const result = runMicMbcRatio({ mbcMgPerL: 1, micMgPerL: 2 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_ratio");
  });
  it("rejects zero MIC", () =>
    expect(runMicMbcRatio({ mbcMgPerL: 8, micMgPerL: 0 }).ok).toBe(false));
  it("rejects negative concentrations", () =>
    expect(runMicMbcRatio({ mbcMgPerL: -8, micMgPerL: 2 }).ok).toBe(false));
});
