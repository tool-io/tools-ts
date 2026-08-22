import { describe, expect, it } from "vitest";
import { runDistance3d } from "./tool.js";

describe("3D Euclidean Distance Calculator", () => {
  it("calculates a valid result", () => {
    const result = runDistance3d({ x1: 1, y1: 1, z1: 1, x2: 1, y2: 1, z2: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.distance).toBeDefined();
  });
  it("rejects invalid input", () => expect(runDistance3d(null).ok).toBe(false));
});
