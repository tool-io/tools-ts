import { describe, expect, it } from "vitest";
import {
  calculateChebyshevDistance,
  chebyshevDistanceExample,
  runChebyshevDistance,
} from "./tool.js";

describe("Chebyshev Distance Calculator", () => {
  it("calculates the greatest coordinate difference", () =>
    expect(calculateChebyshevDistance([1, 2, 3], [4, 2, -1])).toBe(4));
  it("accepts identical vectors", () =>
    expect(calculateChebyshevDistance([0, 0], [0, 0])).toBe(0));
  it("rejects empty, unequal, and non-finite vectors", () => {
    expect(calculateChebyshevDistance([], [])).toBeNull();
    expect(calculateChebyshevDistance([1, 2], [1])).toBeNull();
    expect(calculateChebyshevDistance([1, Number.NaN], [1, 2])).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runChebyshevDistance(chebyshevDistanceExample.input)).toEqual({
      ok: true,
      output: chebyshevDistanceExample.output,
    }));
});
