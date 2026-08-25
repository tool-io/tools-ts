import { describe, expect, it } from "vitest";
import { runAreaUnderCurveTrapezoidal } from "./tool.js";

describe("Trapezoidal AUC", () => {
  it("calculates a valid result", () =>
    expect(
      runAreaUnderCurveTrapezoidal({
        concEnd: 6,
        concStart: 2,
        timeEnd: 4,
        timeStart: 0,
      }),
    ).toEqual({
      ok: true,
      output: { areaUnderCurve: 16 },
    }));
  it("returns zero for a flat zero concentration", () =>
    expect(
      runAreaUnderCurveTrapezoidal({
        concEnd: 0,
        concStart: 0,
        timeEnd: 5,
        timeStart: 1,
      }),
    ).toEqual({
      ok: true,
      output: { areaUnderCurve: 0 },
    }));
  it("handles a rising segment", () => {
    const result = runAreaUnderCurveTrapezoidal({
      concEnd: 8,
      concStart: 0,
      timeEnd: 2,
      timeStart: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.areaUnderCurve).toBe(8);
  });
  it("handles a falling segment", () => {
    const result = runAreaUnderCurveTrapezoidal({
      concEnd: 1,
      concStart: 5,
      timeEnd: 3,
      timeStart: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.areaUnderCurve).toBe(6);
  });
  it("supports offsets start times away from zero", () => {
    const result = runAreaUnderCurveTrapezoidal({
      concEnd: 4,
      concStart: 4,
      timeEnd: 10,
      timeStart: 8,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.areaUnderCurve).toBe(8);
  });
  it("rejects equal times", () => {
    const result = runAreaUnderCurveTrapezoidal({
      concEnd: 3,
      concStart: 2,
      timeEnd: 5,
      timeStart: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("degenerate_interval");
  });
  it("rejects inverted intervals", () =>
    expect(
      runAreaUnderCurveTrapezoidal({
        concEnd: 3,
        concStart: 2,
        timeEnd: 1,
        timeStart: 5,
      }).ok,
    ).toBe(false));
  it("rejects negative concentrations", () =>
    expect(
      runAreaUnderCurveTrapezoidal({
        concEnd: 3,
        concStart: -2,
        timeEnd: 5,
        timeStart: 1,
      }).ok,
    ).toBe(false));
});
