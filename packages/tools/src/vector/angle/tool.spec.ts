import { describe, expect, it } from "vitest";
import { runAngle } from "./tool.js";
describe("Angle Between Vectors Calculator", () => {
  it("calculates a valid result", () => {
    const result = runAngle({ first: [1, 0], second: [0, 1] });
    expect(result.ok && result.output.degrees).toBeCloseTo(90);
  });
  it("rejects invalid input", () => expect(runAngle(null).ok).toBe(false));
});
