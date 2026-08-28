import { describe, expect, it } from "vitest";
import { runDiffusionCoefficient } from "./tool.js";

describe("Diffusion Coefficient Calculator", () => {
  it("calculates a valid result", () => {
    const result = runDiffusionCoefficient({
      dimensions: 3,
      meanSquaredDisplacementCm2: 30,
      timeSeconds: 5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.diffusionCoefficientCm2S).toBeCloseTo(1, 9);
  });

  it("rejects invalid input", () =>
    expect(runDiffusionCoefficient(null).ok).toBe(false));
});
