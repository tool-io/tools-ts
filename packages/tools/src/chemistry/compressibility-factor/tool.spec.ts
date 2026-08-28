import { describe, expect, it } from "vitest";
import { runCompressibilityFactor } from "./tool.js";

describe("Compressibility Factor Calculator", () => {
  it("returns one for an ideal-like sample", () => {
    const result = runCompressibilityFactor({
      moles: 1,
      pressureAtm: 0.08206,
      temperatureK: 300,
      volumeL: 300,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.z).toBeCloseTo(1, 6);
  });

  it("rejects invalid input", () =>
    expect(runCompressibilityFactor(null).ok).toBe(false));
});
