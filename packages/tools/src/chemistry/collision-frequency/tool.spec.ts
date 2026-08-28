import { describe, expect, it } from "vitest";
import { runCollisionFrequency } from "./tool.js";

describe("Collision Frequency Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCollisionFrequency({
      meanSpeedMs: 1,
      collisionDiameterNM: 1,
      numberDensityM3: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.collisionFrequencyHz).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runCollisionFrequency(null).ok).toBe(false));
});
