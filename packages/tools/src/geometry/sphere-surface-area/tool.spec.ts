import { describe, expect, it } from "vitest";
import { runSphereSurfaceArea } from "./tool.js";

describe("Sphere Surface Area Calculator", () => {
  it("calculates a valid result", () => {
    const result = runSphereSurfaceArea({ radius: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.surfaceArea).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runSphereSurfaceArea(null).ok).toBe(false));
});
