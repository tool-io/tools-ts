import { describe, expect, it } from "vitest";
import {
  deadReckoningPositionExample,
  runDeadReckoningPosition,
} from "./tool.js";

describe("Dead Reckoning Position Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDeadReckoningPosition(deadReckoningPositionExample.input),
    ).toEqual({
      ok: true,
      output: deadReckoningPositionExample.output,
    });
  });

  it("moves north by one degree per sixty nautical miles", () => {
    expect(
      runDeadReckoningPosition({
        courseDeg: 0,
        distanceNm: 60,
        startLatitudeDeg: 40,
        startLongitudeDeg: -74,
      }),
    ).toEqual({
      ok: true,
      output: { latitudeDeg: 41, longitudeDeg: -74 },
    });
  });

  it("moves south with a reciprocal course", () => {
    expect(
      runDeadReckoningPosition({
        courseDeg: 180,
        distanceNm: 60,
        startLatitudeDeg: 40,
        startLongitudeDeg: -74,
      }),
    ).toEqual({
      ok: true,
      output: { latitudeDeg: 39, longitudeDeg: -74 },
    });
  });

  it("increases longitude on an easting leg near the equator", () => {
    const result = runDeadReckoningPosition({
      courseDeg: 90,
      distanceNm: 60,
      startLatitudeDeg: 0,
      startLongitudeDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.longitudeDeg).toBeCloseTo(1, 9);
    expect(result.output.latitudeDeg).toBeCloseTo(0, 9);
  });

  it("normalizes westward runs across the antimeridian", () => {
    const result = runDeadReckoningPosition({
      courseDeg: 270,
      distanceNm: 120,
      startLatitudeDeg: 0,
      startLongitudeDeg: -179,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.longitudeDeg).toBe(179);
    expect(result.output.latitudeDeg).toBeCloseTo(0, 9);
  });

  it("reports a polar limit error near the pole", () => {
    const result = runDeadReckoningPosition({
      courseDeg: 0,
      distanceNm: 30,
      startLatitudeDeg: 89.4,
      startLongitudeDeg: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("polar_limit");
  });

  it("accepts courses just short of the polar limit", () => {
    const result = runDeadReckoningPosition({
      courseDeg: 0,
      distanceNm: 60,
      startLatitudeDeg: 88,
      startLongitudeDeg: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.latitudeDeg).toBeCloseTo(89, 9);
  });

  it("keeps the starting position at zero distance and rejects negatives", () => {
    const zero = runDeadReckoningPosition({
      courseDeg: 45,
      distanceNm: 0,
      startLatitudeDeg: 40,
      startLongitudeDeg: -74,
    });
    expect(zero).toEqual({
      ok: true,
      output: { latitudeDeg: 40, longitudeDeg: -74 },
    });
    expect(
      runDeadReckoningPosition({
        courseDeg: 45,
        distanceNm: -1,
        startLatitudeDeg: 40,
        startLongitudeDeg: -74,
      }).ok,
    ).toBe(false);
  });

  it("rejects out-of-range coordinates and courses", () => {
    expect(
      runDeadReckoningPosition({
        courseDeg: 0,
        distanceNm: 10,
        startLatitudeDeg: 91,
        startLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
    expect(
      runDeadReckoningPosition({
        courseDeg: 0,
        distanceNm: 10,
        startLatitudeDeg: 0,
        startLongitudeDeg: -181,
      }).ok,
    ).toBe(false);
    expect(
      runDeadReckoningPosition({
        courseDeg: 361,
        distanceNm: 10,
        startLatitudeDeg: 0,
        startLongitudeDeg: 0,
      }).ok,
    ).toBe(false);
  });

  it("rejects missing input fields", () => {
    expect(runDeadReckoningPosition({ courseDeg: 90, distanceNm: 10 }).ok).toBe(
      false,
    );
  });
});
