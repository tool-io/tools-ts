import { describe, expect, it } from "vitest";
import { runEncephalizationQuotient } from "./tool.js";

describe("Encephalization Quotient", () => {
  it("calculates a valid result", () =>
    expect(
      runEncephalizationQuotient({ actualBrainGrams: 1400, bodyMassKg: 70 }),
    ).toEqual({
      ok: true,
      output: { encephalizationQuotient: 4.941521261922714 },
    }));
  it("equals one on the primate reference line", () => {
    const expected = 11.22 * Math.pow(70, 0.76);
    const result = runEncephalizationQuotient({
      actualBrainGrams: expected,
      bodyMassKg: 70,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.encephalizationQuotient).toBeCloseTo(1, 12);
  });
  it("doubles when observed brain mass doubles", () => {
    const base = runEncephalizationQuotient({
      actualBrainGrams: 700,
      bodyMassKg: 70,
    });
    const doubled = runEncephalizationQuotient({
      actualBrainGrams: 1400,
      bodyMassKg: 70,
    });
    expect(base.ok && doubled.ok).toBe(true);
    if (base.ok && doubled.ok)
      expect(
        Number(doubled.output.encephalizationQuotient) /
          Number(base.output.encephalizationQuotient),
      ).toBe(2);
  });
  it("equals one along the reference line at any body mass", () => {
    const small = runEncephalizationQuotient({
      actualBrainGrams: 11.22 * Math.pow(10, 0.76),
      bodyMassKg: 10,
    });
    const large = runEncephalizationQuotient({
      actualBrainGrams: 11.22 * Math.pow(100, 0.76),
      bodyMassKg: 100,
    });
    expect(small.ok && large.ok).toBe(true);
    if (small.ok && large.ok) {
      expect(small.output.encephalizationQuotient).toBeCloseTo(1, 12);
      expect(large.output.encephalizationQuotient).toBeCloseTo(1, 12);
    }
  });
  it("rejects zero brain mass", () =>
    expect(
      runEncephalizationQuotient({ actualBrainGrams: 0, bodyMassKg: 70 }).ok,
    ).toBe(false));
  it("rejects zero body mass", () =>
    expect(
      runEncephalizationQuotient({ actualBrainGrams: 1400, bodyMassKg: 0 }).ok,
    ).toBe(false));
  it("rejects negative body mass", () =>
    expect(
      runEncephalizationQuotient({ actualBrainGrams: 1400, bodyMassKg: -70 })
        .ok,
    ).toBe(false));
});
