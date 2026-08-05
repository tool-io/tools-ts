import { describe, expect, it } from "vitest";
import {
  calculateEuclideanDistance,
  euclideanDistanceExample,
  runEuclideanDistance,
} from "./tool.js";

describe("Euclidean Distance Calculator", () => {
  it("calculates straight-line distance", () =>
    expect(calculateEuclideanDistance([0, 0], [3, 4])).toBe(5));
  it("supports vectors of any equal length", () =>
    expect(calculateEuclideanDistance([-1, -1], [2, 3])).toBe(5));
  it("rejects empty, unequal, and non-finite vectors", () => {
    expect(calculateEuclideanDistance([], [])).toBeNull();
    expect(calculateEuclideanDistance([1, 2], [1])).toBeNull();
    expect(calculateEuclideanDistance([1, Number.NaN], [1, 2])).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runEuclideanDistance(euclideanDistanceExample.input)).toEqual({
      ok: true,
      output: euclideanDistanceExample.output,
    }));
});
