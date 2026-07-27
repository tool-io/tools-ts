import { describe, expect, it } from "vitest";
import {
  bodyRoundnessIndexExample,
  calculateBodyRoundnessIndex,
} from "./tool.js";

describe("Body Roundness Index Calculator", () => {
  it("calculates the preserved web example", () => {
    const result = calculateBodyRoundnessIndex(bodyRoundnessIndexExample.input);

    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.bodyRoundnessIndex).toBeCloseTo(1.5111372805, 10);
  });

  it("is independent of the shared measurement unit", () => {
    const centimeters = calculateBodyRoundnessIndex({
      heightCm: 180,
      waistCm: 70,
    });
    const proportionalValues = calculateBodyRoundnessIndex({
      heightCm: 1.8,
      waistCm: 0.7,
    });

    expect(centimeters).toEqual(proportionalValues);
  });

  it.each([
    undefined,
    {},
    { heightCm: 0, waistCm: 70 },
    { heightCm: 180, waistCm: 0 },
    { heightCm: Number.NaN, waistCm: 70 },
    { heightCm: 180, waistCm: Number.POSITIVE_INFINITY },
    { heightCm: 1, waistCm: Math.PI + 0.01 },
    { extra: true, heightCm: 180, waistCm: 70 },
  ])("rejects invalid or unsupported input", (input) => {
    expect(calculateBodyRoundnessIndex(input).ok).toBe(false);
  });
});
