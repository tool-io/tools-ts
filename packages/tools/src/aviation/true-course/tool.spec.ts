import { describe, expect, it } from "vitest";
import { runTrueCourse } from "./tool.js";
describe("True Course Calculator", () => {
  it("calculates a valid result", () =>
    expect(runTrueCourse({ magneticCourseDeg: 350, variationDeg: 15 })).toEqual(
      { ok: true, output: { trueCourseDeg: 5 } },
    ));
  it("wraps below north for west variation", () =>
    expect(runTrueCourse({ magneticCourseDeg: 10, variationDeg: -20 })).toEqual(
      {
        ok: true,
        output: { trueCourseDeg: 350 },
      },
    ));
  it("keeps the course unchanged without variation", () =>
    expect(runTrueCourse({ magneticCourseDeg: 90, variationDeg: 0 })).toEqual({
      ok: true,
      output: { trueCourseDeg: 90 },
    }));
  it("returns zero at a full circle", () =>
    expect(
      runTrueCourse({ magneticCourseDeg: 359.5, variationDeg: 0.5 }),
    ).toEqual({
      ok: true,
      output: { trueCourseDeg: 0 },
    }));
  it("handles fractional degrees", () => {
    const result = runTrueCourse({
      magneticCourseDeg: 12.3,
      variationDeg: 4.567,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.trueCourseDeg).toBeCloseTo(16.867, 12);
  });
  it("rejects variation beyond east bound", () =>
    expect(
      runTrueCourse({ magneticCourseDeg: 90, variationDeg: 180.1 }).ok,
    ).toBe(false));
  it("rejects variation beyond west bound", () =>
    expect(
      runTrueCourse({ magneticCourseDeg: 90, variationDeg: -180.1 }).ok,
    ).toBe(false));
});
