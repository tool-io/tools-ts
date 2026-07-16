import { describe, expect, it } from "vitest";
import {
  calculateJacksonPollock3SiteBodyFat,
  jacksonPollock3SiteBodyFatTool,
} from "./tool.js";

describe("Jackson–Pollock three-site body fat", () => {
  it("calculates the male equation and Siri conversion", () => {
    const result = calculateJacksonPollock3SiteBodyFat({
      ageYears: 30,
      sex: "male",
      skinfoldsMm: [10, 15, 20],
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.skinfoldSumMm).toBe(45);
      expect(result.output.bodyDensityGPerCm3).toBeCloseTo(1.0676965, 7);
      expect(result.output.bodyFatPercent).toBeCloseTo(13.6148943075, 8);
    }
  });

  it("requires exactly three positive measurements", () => {
    expect(
      calculateJacksonPollock3SiteBodyFat({
        ageYears: 30,
        sex: "female",
        skinfoldsMm: [10, 20],
      }),
    ).toMatchObject({ error: { code: "invalid_input" }, ok: false });
  });

  it("publishes a pure tool contract", () => {
    expect(jacksonPollock3SiteBodyFatTool.id).toBe(
      "jackson-pollock-3-site-body-fat",
    );
  });
});
