import { describe, expect, it } from "vitest";
import { runCuboidVolume } from "./tool.js";

describe("Cuboid Volume Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCuboidVolume({ length: 1, width: 1, height: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.volume).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runCuboidVolume(null).ok).toBe(false));
});
