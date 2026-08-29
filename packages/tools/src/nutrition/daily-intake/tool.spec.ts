import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateDailyIntake,
  dailyIntakeExample,
  dailyIntakeTool,
} from "./tool.js";

describe("Daily Nutrition Intake", () => {
  it("executes its canonical multi-food example exactly", () => {
    expect(dailyIntakeTool.execute(dailyIntakeExample.input)).toEqual({
      ok: true,
      output: dailyIntakeExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(dailyIntakeTool)).toEqual([]);
  });

  it("converts compatible nutrient units and marks partial totals", () => {
    const result = calculateDailyIntake({
      foods: [
        {
          id: "a",
          name: "A",
          grams: 50,
          nutrients: [
            { id: "iron", label: "Iron", amountPer100g: 0.01, unit: "g" },
          ],
        },
        { id: "b", name: "B", grams: 25, nutrients: [] },
      ],
      referenceProfileId: "example-profile",
      referenceValues: [
        {
          id: "iron",
          label: "Iron",
          amount: 18,
          unit: "mg",
          comparison: "minimum",
          referenceType: "RNI",
        },
      ],
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        foodCount: 2,
        nutrients: [
          {
            complete: false,
            total: 5,
            unit: "mg",
            reference: { percentage: 27.77777777777778 },
          },
        ],
        totalGrams: 75,
      },
    });
  });

  it("rejects duplicate foods, duplicate nutrients, invalid masses, and malformed ranges", () => {
    const result = calculateDailyIntake({
      foods: [
        {
          id: "same",
          name: "A",
          grams: 0,
          nutrients: [
            { id: "protein", label: "Protein", amountPer100g: 1, unit: "g" },
            { id: "protein", label: "Protein", amountPer100g: 2, unit: "g" },
          ],
        },
        { id: "same", name: "B", grams: 10, nutrients: [] },
      ],
      referenceValues: [
        {
          id: "protein",
          label: "Protein",
          amount: 50,
          upperAmount: 40,
          unit: "g",
          comparison: "range",
          referenceType: "range",
        },
      ],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.issues.map(({ code }) => code)).toEqual(
        expect.arrayContaining([
          "grams_invalid",
          "duplicate_nutrient",
          "duplicate_selection",
          "reference_range_invalid",
        ]),
      );
    }
  });

  it("allows the same canonical food to be selected twice with distinct selection IDs", () => {
    const result = calculateDailyIntake({
      foods: [
        {
          id: "usda-fdc-1",
          selectionId: "first",
          name: "Food",
          grams: 25,
          nutrients: [
            { id: "protein", label: "Protein", amountPer100g: 4, unit: "g" },
          ],
        },
        {
          id: "usda-fdc-1",
          selectionId: "second",
          name: "Food",
          grams: 75,
          nutrients: [
            { id: "protein", label: "Protein", amountPer100g: 4, unit: "g" },
          ],
        },
      ],
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        nutrients: [
          {
            contributions: [
              { foodId: "usda-fdc-1", selectionId: "first", amount: 1 },
              { foodId: "usda-fdc-1", selectionId: "second", amount: 3 },
            ],
            total: 4,
          },
        ],
      },
    });
  });

  it("rejects incompatible units for the same nutrient identifier", () => {
    const result = calculateDailyIntake({
      foods: [
        {
          id: "a",
          name: "A",
          grams: 100,
          nutrients: [
            {
              id: "nutrient.energy",
              label: "Energy",
              amountPer100g: 100,
              unit: "kcal",
            },
          ],
        },
        {
          id: "b",
          name: "B",
          grams: 100,
          nutrients: [
            {
              id: "nutrient.energy",
              label: "Energy",
              amountPer100g: 2,
              unit: "g",
            },
          ],
        },
      ],
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(
        result.error.issues.some(
          ({ code }) => code === "nutrient_unit_incompatible",
        ),
      ).toBe(true);
  });

  it("requires an identified nonempty reference profile and rejects undeclared fields", () => {
    const result = calculateDailyIntake({
      foods: [
        {
          grams: 100,
          id: "a",
          name: "A",
          nutrients: [],
          unsupported: true,
        },
      ],
      referenceValues: [],
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues.map(({ code }) => code)).toEqual(
        expect.arrayContaining([
          "unknown_field",
          "reference_profile_incomplete",
          "reference_values_empty",
          "nutrients_empty",
        ]),
      );
  });
});
