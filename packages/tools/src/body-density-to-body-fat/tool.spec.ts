import { describe, expect, it } from "vitest";
import {
  bodyDensityToBodyFatTool,
  calculateBodyDensityToBodyFat,
} from "./tool.js";

describe("body density to body fat", () => {
  it("uses Siri by default", () => {
    const result = calculateBodyDensityToBodyFat({ densityGPerCm3: 1.05 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.equation).toBe("siri");
      expect(result.output.bodyFatPercent).toBeCloseTo(21.4285714286, 10);
    }
  });

  it("supports the Brozek equation", () => {
    const result = calculateBodyDensityToBodyFat({
      densityGPerCm3: 1.05,
      equation: "brozek",
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.bodyFatPercent).toBeCloseTo(21.0380952381, 10);
  });

  it("rejects invalid density", () => {
    expect(calculateBodyDensityToBodyFat({ densityGPerCm3: 0 })).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });

  it("publishes a pure tool contract", () => {
    expect(bodyDensityToBodyFatTool.id).toBe("body-density-to-body-fat");
  });
});
