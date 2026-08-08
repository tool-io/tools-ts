import { describe, expect, it } from "vitest";
import { calculateSwitzerlandTakeHomePay } from "./tool.js";

describe("Switzerland take-home pay", () => {
  it("defaults to Zürich and returns a breakdown", () => {
    const result = calculateSwitzerlandTakeHomePay({ grossPay: 50_000 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.location).toContain("Zürich");
  });

  it("accepts supported canton codes", () => {
    expect(
      calculateSwitzerlandTakeHomePay({ grossPay: 50_000, location: "ZG" }).ok,
    ).toBe(true);
  });

  it("preserves the advanced Zug fixture", () => {
    const result = calculateSwitzerlandTakeHomePay({
      children: 2,
      churchTax: true,
      grossPay: 120_000,
      location: "ZG",
      maritalStatus: "married",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.netAnnual).toBeCloseTo(102_744.513432, 8);
    expect(result.output.ruleVersion).toBe("ch-2026-reference.1");
    expect(result.output.warnings).toHaveLength(1);
  });
});
