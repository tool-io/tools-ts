import { describe, expect, it } from "vitest";
import { calculateDistance, distanceExample, runDistance } from "./tool.js";

describe("Distance Calculator", () => {
  it("calculates 2D and 3D Euclidean distance", () => {
    expect(calculateDistance(distanceExample.input)).toBe(5);
    expect(
      calculateDistance({
        mode: "3d-euclidean",
        point1A: 1,
        point1B: 2,
        point1Z: 3,
        point2A: 4,
        point2B: 5,
        point2Z: 6,
      }),
    ).toBeCloseTo(Math.sqrt(27), 12);
  });
  it("calculates Haversine and Andoyer-Lambert distances", () => {
    const coordinates = {
      point1A: 36.12,
      point1B: -86.67,
      point2A: 33.94,
      point2B: -118.4,
    };
    expect(
      calculateDistance({ mode: "geographic-haversine", ...coordinates }),
    ).toBeCloseTo(2886.448429764854, 9);
    expect(
      calculateDistance({ mode: "geographic-lambert", ...coordinates }),
    ).toBeCloseTo(2892.7770425553135, 9);
  });
  it("rejects incomplete and invalid coordinates", () => {
    expect(
      calculateDistance({
        mode: "3d-euclidean",
        point1A: 0,
        point1B: 0,
        point2A: 3,
        point2B: 4,
      }),
    ).toBeNull();
    expect(
      calculateDistance({
        mode: "geographic-haversine",
        point1A: 91,
        point1B: 0,
        point2A: 0,
        point2B: 0,
      }),
    ).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runDistance(distanceExample.input)).toEqual({
      ok: true,
      output: distanceExample.output,
    }));
});
