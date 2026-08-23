import { describe, expect, it } from "vitest";
import {
  calculateEntryAgeNormalLiability,
  entryAgeNormalLiabilityExample,
  runEntryAgeNormalLiability,
} from "./tool.js";

describe("entry age normal liability calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEntryAgeNormalLiability(entryAgeNormalLiabilityExample.input),
    ).toEqual({
      ok: true,
      output: entryAgeNormalLiabilityExample.output,
    });
  });

  it("accumulates the liability with service", () => {
    const later = calculateEntryAgeNormalLiability({
      discountRatePercent: 0,
      projectedRetirementBenefit: 120,
      retirementYearsFromEntry: 4,
      yearsSinceEntry: 3,
    });
    expect(later.normalCost).toBe(30);
    expect(later.entryAgeNormalLiability).toBe(90);
  });

  it("equals the full pension at the retirement boundary", () => {
    const retirement = calculateEntryAgeNormalLiability({
      discountRatePercent: 10,
      projectedRetirementBenefit: 100,
      retirementYearsFromEntry: 3,
      yearsSinceEntry: 3,
    });
    expect(retirement.normalCost).toBe(27.464982147761596);
    expect(retirement.entryAgeNormalLiability).toBe(100);
  });

  it("accumulates reserves plus normal cost into the benefit with interest", () => {
    const base = {
      discountRatePercent: 10,
      projectedRetirementBenefit: 100,
      retirementYearsFromEntry: 3,
    };
    const entry = calculateEntryAgeNormalLiability({
      ...base,
      yearsSinceEntry: 0,
    });
    expect(entry.entryAgeNormalLiability).toBe(0);
    expect(entry.normalCost).toBe(27.464982147761596);
    let liability = entry.entryAgeNormalLiability;
    for (let year = 1; year <= 3; year += 1) {
      const current = calculateEntryAgeNormalLiability({
        ...base,
        yearsSinceEntry: year,
      });
      liability = (liability + current.normalCost) * 1.1;
      expect(current.entryAgeNormalLiability).toBeCloseTo(liability, 8);
    }
    expect(liability).toBeCloseTo(100, 8);
  });

  it("accepts a negative discount rate above -100 percent", () => {
    const negative = calculateEntryAgeNormalLiability({
      discountRatePercent: -10,
      projectedRetirementBenefit: 100,
      retirementYearsFromEntry: 2,
      yearsSinceEntry: 1,
    });
    expect(negative.normalCost).toBe(58.47953216374269);
    expect(negative.entryAgeNormalLiability).toBeCloseTo(
      52.631578947368425,
      12,
    );
  });

  it("rejects service beyond the working period and invalid inputs", () => {
    expect(
      runEntryAgeNormalLiability({
        discountRatePercent: 0,
        projectedRetirementBenefit: 100,
        retirementYearsFromEntry: 2,
        yearsSinceEntry: 3,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "service_exceeds_term", field: "yearsSinceEntry" }],
      },
      ok: false,
    });
    expect(
      runEntryAgeNormalLiability({ projectedRetirementBenefit: 100 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "discountRatePercent" }],
      },
      ok: false,
    });
    expect(
      runEntryAgeNormalLiability({
        discountRatePercent: -100,
        projectedRetirementBenefit: 100,
        retirementYearsFromEntry: 2,
        yearsSinceEntry: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_interest_rate", field: "discountRatePercent" },
        ],
      },
      ok: false,
    });
  });
});
