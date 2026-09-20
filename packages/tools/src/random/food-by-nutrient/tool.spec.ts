import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  foodByNutrientExample as example,
  calculateFoodByNutrient,
} from "./tool.js";

describe("Random Food by Nutrient Picker", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateFoodByNutrient(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("keeps full record identity and provenance while filtering inclusively", () => {
    const result = tool.execute({
      ...example.input,
      minimumPer100g: 21,
      maximumPer100g: 28,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.selectedFoods).toEqual([
      example.input.foods[2],
      example.input.foods[0],
    ]);
    expect(result.output.eligibleCount).toBe(2);
    expect(tool.execution).toEqual({
      kind: "data",
      datasets: [{ id: "nutrition/food-composition", schemaVersion: 1 }],
    });
  });
  it("does not silently equate missing nutrients with zero or convert unmatched units", () => {
    expect(
      tool.execute({
        ...example.input,
        nutrientId: "nutrient.fiber",
        minimumPer100g: 0,
        maximumPer100g: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "foods", code: "no_matching_foods" }] },
    });
    expect(tool.execute({ ...example.input, unit: "mg" })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "unit", code: "nutrient_unit_mismatch" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        minimumPer100g: 21,
        maximumPer100g: 21,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "selectionCount", code: "insufficient_eligible_foods" },
        ],
      },
    });
    const repeated = tool.execute({
      ...example.input,
      minimumPer100g: 21,
      maximumPer100g: 21,
      withReplacement: true,
    });
    if (!repeated.ok) throw new Error("Expected success");
    expect(repeated.output.selectedFoods.map((food) => food.id)).toEqual([
      "usda-fdc-1",
      "usda-fdc-1",
    ]);
  });
  it("rejects ambiguous identities, duplicate nutrient fields and malformed entries", () => {
    expect(
      tool.execute({
        ...example.input,
        foods: [example.input.foods[0], example.input.foods[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "foods", code: "duplicate_food_ids" }] },
    });
    expect(
      tool.execute({ ...example.input, sourceId: "different-source" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "foods", code: "invalid_food_provenance" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        foods: [
          {
            ...example.input.foods[0],
            nutrients: [
              example.input.foods[0].nutrients[0],
              example.input.foods[0].nutrients[0],
            ],
          },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "foods", code: "duplicate_food_fields" }] },
    });
    expect(
      tool.execute({ ...example.input, maximumPer100g: 10 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumPer100g", code: "invalid_nutrient_range" }],
      },
    });
  });
});
