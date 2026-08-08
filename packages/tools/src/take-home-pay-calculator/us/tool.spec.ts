import { describe, expect, it } from "vitest";
import { calculateUSTakeHomePay } from "./tool.js";

describe("US take-home pay", () => {
  it("includes federal and California deductions by default", () => {
    const result = calculateUSTakeHomePay({ grossPay: 50_000 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.location).toBe("San Francisco, California");
    expect(result.output.deductions.map(({ code }) => code)).toEqual(
      expect.arrayContaining([
        "federal_income_tax",
        "california_income_tax",
        "california_sdi",
      ]),
    );
  });

  it("rejects an unsupported location", () => {
    expect(
      calculateUSTakeHomePay({ grossPay: 50_000, location: "unknown" }).ok,
    ).toBe(false);
  });

  it("preserves the advanced federal-only fixture", () => {
    const result = calculateUSTakeHomePay({
      dependentCredit: 2_000,
      filingStatus: "married",
      grossPay: 120_000,
      location: "federal",
      preTax: 6_000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.netAnnual).toBe(97_500);
    expect(result.output.ruleVersion).toBe("us-2026.1");
  });
});
