import { describe, expect, it } from "vitest";
import {
  calculateDxaBodyCompositionSummary,
  dxaBodyCompositionSummaryTool,
} from "./tool.js";

describe("DXA body composition summary", () => {
  it("summarizes measured component masses", () => {
    const result = calculateDxaBodyCompositionSummary({
      boneMineralContentKg: 3,
      fatMassKg: 20,
      leanMassKg: 50,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.totalMeasuredMassKg).toBe(73);
      expect(result.output.fatMassPercent).toBeCloseTo((20 / 73) * 100, 12);
      expect(
        result.output.boneMineralContentPercent +
          result.output.fatMassPercent +
          result.output.leanMassPercent,
      ).toBeCloseTo(100, 12);
    }
  });

  it("rejects an empty report summary", () => {
    expect(
      calculateDxaBodyCompositionSummary({
        boneMineralContentKg: 0,
        fatMassKg: 0,
        leanMassKg: 0,
      }),
    ).toMatchObject({ error: { code: "invalid_input" }, ok: false });
  });

  it("publishes a pure tool contract", () => {
    expect(dxaBodyCompositionSummaryTool.id).toBe(
      "dxa-body-composition-summary",
    );
  });
});
