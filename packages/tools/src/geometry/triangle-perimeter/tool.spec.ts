import { describe, expect, it } from "vitest";
import { runTrianglePerimeter } from "./tool.js";

describe("Triangle Perimeter Calculator", () => {
  it("calculates a valid result", () => {
    const result = runTrianglePerimeter({ sideA: 1, sideB: 1, sideC: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.perimeter).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runTrianglePerimeter(null).ok).toBe(false));
});
