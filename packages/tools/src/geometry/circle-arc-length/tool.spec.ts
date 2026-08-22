import { describe, expect, it } from "vitest";
import { runCircleArcLength } from "./tool.js";
describe("circle arc length calculator", () => {
  it("arc for full circle equals circumference", () => {
    const r = runCircleArcLength({ angleDeg: 360, radius: 1 });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.arcLength).toBeCloseTo(2 * Math.PI, 9);
  });
});
