import { describe, expect, it } from "vitest";
import { runBodyConditionScoreDairy } from "./tool.js";

describe("BCD From Ratio", () => {
  it("defaults the ratio to score five", () =>
    expect(runBodyConditionScoreDairy({})).toEqual({
      ok: true,
      output: { bodyConditionScore: 5 },
    }));
  it("maps a ratio of zero point four to score two", () =>
    expect(
      runBodyConditionScoreDairy({ bodyConditionRatioInput: 0.4 }),
    ).toEqual({ ok: true, output: { bodyConditionScore: 2 } }));
  it("rounds a ratio of zero point five up to score three", () =>
    expect(
      runBodyConditionScoreDairy({ bodyConditionRatioInput: 0.5 }),
    ).toEqual({ ok: true, output: { bodyConditionScore: 3 } }));
  it("rounds a ratio of zero point one up to score one", () =>
    expect(
      runBodyConditionScoreDairy({ bodyConditionRatioInput: 0.1 }),
    ).toEqual({ ok: true, output: { bodyConditionScore: 1 } }));
  it("clamps a ratio of zero to the minimum score one", () =>
    expect(runBodyConditionScoreDairy({ bodyConditionRatioInput: 0 })).toEqual({
      ok: true,
      output: { bodyConditionScore: 1 },
    }));
  it("clamps a ratio of two to the maximum score five", () =>
    expect(runBodyConditionScoreDairy({ bodyConditionRatioInput: 2 })).toEqual({
      ok: true,
      output: { bodyConditionScore: 5 },
    }));
  it("clamps ratios above one that round past five", () =>
    expect(
      runBodyConditionScoreDairy({ bodyConditionRatioInput: 1.3 }),
    ).toEqual({ ok: true, output: { bodyConditionScore: 5 } }));
  it("rejects ratios above two", () =>
    expect(
      runBodyConditionScoreDairy({ bodyConditionRatioInput: 2.5 }).ok,
    ).toBe(false));
});
