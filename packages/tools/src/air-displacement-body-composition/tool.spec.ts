import { describe, expect, it } from "vitest";
import {
  airDisplacementBodyCompositionTool,
  calculateAirDisplacementBodyComposition,
} from "./tool.js";

describe("air-displacement body composition", () => {
  it("calculates composition from corrected measured volume", () => {
    const result = calculateAirDisplacementBodyComposition({
      bodyMassKg: 70,
      correctedBodyVolumeL: 68,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.bodyDensityGPerCm3).toBeCloseTo(70 / 68, 12);
      expect(result.output.bodyFatPercent).toBeCloseTo(30.8571428571, 8);
      expect(result.output.estimatedFatMassKg).toBeCloseTo(21.6, 8);
      expect(result.output.estimatedFatFreeMassKg).toBeCloseTo(48.4, 8);
    }
  });

  it("rejects missing device measurements", () => {
    expect(
      calculateAirDisplacementBodyComposition({ bodyMassKg: 70 }),
    ).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    });
  });

  it("publishes a pure tool contract", () => {
    expect(airDisplacementBodyCompositionTool.id).toBe(
      "air-displacement-body-composition",
    );
  });
});
