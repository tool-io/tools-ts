import { describe, expect, it } from "vitest";
import {
  calculateHousingAffordability,
  housingPriceToIncomeAffordabilityExample,
  housingPriceToIncomeAffordabilityTool,
  runHousingPriceToIncomeAffordability,
} from "./tool.js";

describe("housingPriceToIncomeAffordabilityTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runHousingPriceToIncomeAffordability(
        housingPriceToIncomeAffordabilityExample.input,
      ),
    ).toEqual({
      ok: true,
      output: housingPriceToIncomeAffordabilityExample.output,
    });
  });

  it("treats exactly three annual incomes as the configured affordability boundary", () => {
    expect(
      calculateHousingAffordability({
        medianHomePrice: 240000,
        medianHouseholdIncome: 80000,
      }),
    ).toEqual({ affordableAtThree: true, priceToIncomeRatio: 3 });
    const result = runHousingPriceToIncomeAffordability({
      medianHomePrice: 1,
      medianHouseholdIncome: 0,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("medianHouseholdIncome");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(housingPriceToIncomeAffordabilityExample)),
    ).toEqual(housingPriceToIncomeAffordabilityExample);
    expect(housingPriceToIncomeAffordabilityTool.contractVersion).toBe(1);
    expect(housingPriceToIncomeAffordabilityTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runHousingPriceToIncomeAffordability(null).ok).toBe(false);
    expect(
      runHousingPriceToIncomeAffordability({
        ...housingPriceToIncomeAffordabilityExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
