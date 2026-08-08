import { describe, expect, it } from "vitest";
import { calculateJapanTakeHomePay } from "./tool.js";

describe("Japan take-home pay", () => {
  it("calculates Tokyo taxes and employee contributions", () => {
    const result = calculateJapanTakeHomePay({ grossPay: 5_000_000 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.location).toBe("Tokyo");
      expect(result.output.netAnnual).toBeGreaterThan(0);
      expect(result.output.netAnnual).toBeLessThan(5_000_000);
    }
  });

  it("preserves the advanced dependent and age-band fixture", () => {
    const result = calculateJapanTakeHomePay({
      ageBand: "40-64",
      dependents: 2,
      grossPay: 8_000_000,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.netAnnual).toBeCloseTo(6_148_636.64, 8);
    expect(result.output.ruleVersion).toBe("jp-2026.1");
  });
});
