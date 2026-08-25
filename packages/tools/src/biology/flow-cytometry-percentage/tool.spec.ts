import { describe, expect, it } from "vitest";
import { runFlowCytometryPercentage } from "./tool.js";

describe("Flow Positive %", () => {
  it("calculates a valid result", () =>
    expect(
      runFlowCytometryPercentage({ positiveEvents: 2500, totalEvents: 10000 }),
    ).toEqual({
      ok: true,
      output: { positivePercent: 25 },
    }));
  it("returns zero for an all-negative sample", () =>
    expect(
      runFlowCytometryPercentage({ positiveEvents: 0, totalEvents: 5000 }),
    ).toEqual({
      ok: true,
      output: { positivePercent: 0 },
    }));
  it("returns one hundred for an all-positive sample", () =>
    expect(
      runFlowCytometryPercentage({ positiveEvents: 800, totalEvents: 800 }),
    ).toEqual({
      ok: true,
      output: { positivePercent: 100 },
    }));
  it("supports fractional percentages", () => {
    const result = runFlowCytometryPercentage({
      positiveEvents: 1,
      totalEvents: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.positivePercent).toBeCloseTo(33.333333333333336, 12);
  });
  it("rejects more positive than total events", () => {
    const result = runFlowCytometryPercentage({
      positiveEvents: 11,
      totalEvents: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_events");
  });
  it("rejects negative positive counts", () =>
    expect(
      runFlowCytometryPercentage({ positiveEvents: -1, totalEvents: 100 }).ok,
    ).toBe(false));
  it("rejects a zero total", () =>
    expect(
      runFlowCytometryPercentage({ positiveEvents: 5, totalEvents: 0 }).ok,
    ).toBe(false));
  it("rejects fractional event counts", () =>
    expect(
      runFlowCytometryPercentage({ positiveEvents: 1.5, totalEvents: 10 }).ok,
    ).toBe(false));
});
