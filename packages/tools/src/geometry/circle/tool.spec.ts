import { describe, expect, it } from "vitest";
import { calculateCircle, circleExample, runCircle } from "./tool.js";

describe("Circle Calculator", () => {
  it.each([
    [{ radius: 5 }],
    [{ diameter: 10 }],
    [{ circumference: 10 * Math.PI }],
    [{ area: 25 * Math.PI }],
  ])("calculates from one measurement", (input) => {
    const result = calculateCircle(input);
    expect(result?.radius).toBeCloseTo(5, 12);
    expect(result?.diameter).toBeCloseTo(10, 12);
  });
  it("supports a zero radius", () =>
    expect(calculateCircle({ radius: 0 })).toEqual({
      area: 0,
      circumference: 0,
      diameter: 0,
      radius: 0,
    }));
  it("rejects missing, ambiguous, negative, and non-finite inputs", () => {
    expect(calculateCircle({})).toBeNull();
    expect(calculateCircle({ diameter: 10, radius: 5 })).toBeNull();
    expect(calculateCircle({ radius: -1 })).toBeNull();
    expect(calculateCircle({ radius: Number.POSITIVE_INFINITY })).toBeNull();
  });
  it("publishes an executable example", () =>
    expect(runCircle(circleExample.input)).toEqual({
      ok: true,
      output: circleExample.output,
    }));
});
