import { describe, expect, it } from "vitest";
import { runMosfetOxideBreakdownField } from "./tool.js";
describe("mosfet oxide breakdown field calculator", () => {
  it("computes E for 4V across 2nm oxide", () => {
    const result = runMosfetOxideBreakdownField({
      breakdownVoltageV: 4,
      oxideThicknessNm: 2,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.breakdownFieldMVcm).toBeCloseTo(20, 6);
  });
});
