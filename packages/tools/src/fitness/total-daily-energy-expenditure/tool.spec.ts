import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateTotalDailyEnergyExpenditure,
  totalDailyEnergyExpenditureExample,
  totalDailyEnergyExpenditureTool,
} from "./tool.js";

describe("Total Daily Energy Expenditure", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = totalDailyEnergyExpenditureTool.execute(
      totalDailyEnergyExpenditureExample.input,
    );
    expect(result).toEqual({
      ok: true,
      output: totalDailyEnergyExpenditureExample.output,
    });
  });

  it("publishes a valid pure tool contract", () => {
    expect(totalDailyEnergyExpenditureTool.id).toBe(
      "fitness/total-daily-energy-expenditure",
    );
    expect(validateToolContract(totalDailyEnergyExpenditureTool)).toEqual([]);
  });

  it("applies every activity multiplier exactly", () => {
    for (const [level, multiplier] of [
      ["sedentary", 1.2],
      ["lightly-active", 1.375],
      ["very-lightly-active", 1.55],
      ["active", 1.725],
      ["very-active", 1.9],
    ] as const) {
      const result = calculateTotalDailyEnergyExpenditure({
        activityLevel: level,
        basalMetabolicRate: 2000,
      });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.caloriesPerDay).toBe(2000 * multiplier);
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateTotalDailyEnergyExpenditure(null).ok).toBe(false);
    expect(
      calculateTotalDailyEnergyExpenditure({ basalMetabolicRate: 1500 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateTotalDailyEnergyExpenditure({ activityLevel: "athletic" }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateTotalDailyEnergyExpenditure({
        activityLevel: "sedentary",
        basalMetabolicRate: 0,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateTotalDailyEnergyExpenditure({
        activityLevel: "sedentary",
        extra: true,
        basalMetabolicRate: 1400,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
