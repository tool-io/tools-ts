import { describe, expect, it } from "vitest";
import { runContrastRatio } from "./tool.js";

describe("Contrast Ratio Calculator", () => {
  it("calculates a valid result", () => {
    const result = runContrastRatio({ luminance1: 1, luminance2: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.contrastRatio).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runContrastRatio(null).ok).toBe(false));
});
