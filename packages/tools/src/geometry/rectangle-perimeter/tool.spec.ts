import { describe, expect, it } from "vitest";
import { runRectanglePerimeter } from "./tool.js";

describe("Rectangle Perimeter Calculator", () => {
  it("calculates a valid result", () => {
    const result = runRectanglePerimeter({ width: 1, height: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.perimeter).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runRectanglePerimeter(null).ok).toBe(false));
});
