import { describe, expect, it } from "vitest";
import { runSelectivityRatio } from "./tool.js";

describe("Selectivity Ratio", () => {
  it("calculates a valid result", () =>
    expect(
      runSelectivityRatio({ offTargetIc50: 500, onTargetIc50: 25 }),
    ).toEqual({
      ok: true,
      output: { selectivityRatio: 20 },
    }));
  it("returns one when IC50 values match", () =>
    expect(
      runSelectivityRatio({ offTargetIc50: 90, onTargetIc50: 90 }),
    ).toEqual({
      ok: true,
      output: { selectivityRatio: 1 },
    }));
  it("supports sub-unit ratios for non-selective compounds", () => {
    const result = runSelectivityRatio({
      offTargetIc50: 12,
      onTargetIc50: 48,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.selectivityRatio).toBe(0.25);
  });
  it("scales linearly with the off-target IC50", () => {
    const result = runSelectivityRatio({
      offTargetIc50: 2500,
      onTargetIc50: 25,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.selectivityRatio).toBe(100);
  });
  it("rejects zero on-target IC50", () => {
    const result = runSelectivityRatio({ offTargetIc50: 500, onTargetIc50: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_on_target");
  });
  it("rejects negative off-target IC50", () => {
    const result = runSelectivityRatio({
      offTargetIc50: -500,
      onTargetIc50: 25,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_off_target");
  });
  it("rejects non-finite inputs", () =>
    expect(
      runSelectivityRatio({
        offTargetIc50: Number.POSITIVE_INFINITY,
        onTargetIc50: 25,
      }).ok,
    ).toBe(false));
});
