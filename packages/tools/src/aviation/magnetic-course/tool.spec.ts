import { describe, expect, it } from "vitest";
import { runMagneticCourse } from "./tool.js";
describe("Magnetic Course Calculator", () => {
  it("calculates a valid result", () =>
    expect(runMagneticCourse({ trueCourseDeg: 5, variationDeg: 15 })).toEqual({
      ok: true,
      output: { magneticCourseDeg: 350 },
    }));
  it("wraps forward for west variation", () =>
    expect(
      runMagneticCourse({ trueCourseDeg: 350, variationDeg: -15 }),
    ).toEqual({ ok: true, output: { magneticCourseDeg: 5 } }));
  it("keeps the course unchanged without variation", () =>
    expect(runMagneticCourse({ trueCourseDeg: 90, variationDeg: 0 })).toEqual({
      ok: true,
      output: { magneticCourseDeg: 90 },
    }));
  it("returns zero at a full circle", () =>
    expect(
      runMagneticCourse({ trueCourseDeg: 0.5, variationDeg: 0.5 }),
    ).toEqual({ ok: true, output: { magneticCourseDeg: 0 } }));
  it("handles fractional degrees", () => {
    const result = runMagneticCourse({
      trueCourseDeg: 200.75,
      variationDeg: 12.5,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected success.");
    expect(result.output.magneticCourseDeg).toBeCloseTo(188.25, 12);
  });
  it("rejects variation beyond east bound", () =>
    expect(
      runMagneticCourse({ trueCourseDeg: 90, variationDeg: 180.5 }).ok,
    ).toBe(false));
  it("rejects variation beyond west bound", () =>
    expect(
      runMagneticCourse({ trueCourseDeg: 90, variationDeg: -180.5 }).ok,
    ).toBe(false));
});
