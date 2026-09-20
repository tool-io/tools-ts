import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  multiRecipeShoppingListExample as example,
  calculateMultiRecipeShoppingList,
} from "./tool.js";

describe("Random Multi-Recipe Shopping List Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMultiRecipeShoppingList(example.input)).toEqual({
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
  it("keeps incompatible dimensions separate when no density is supplied", () => {
    const result = tool.execute({
      recipes: [
        {
          id: "R",
          originalServings: 1,
          ingredients: [
            { ingredientId: "x", amount: 100, dimension: "mass", unit: "g" },
            { ingredientId: "x", amount: 50, dimension: "volume", unit: "ml" },
          ],
        },
      ],
      selectionCount: 1,
      withoutReplacement: true,
      targetServings: [1],
      densities: [],
      seed: 1,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        shoppingList: [
          { ingredientId: "x", unit: "g", amount: 100 },
          { ingredientId: "x", unit: "ml", amount: 50 },
        ],
      },
    });
  });
  it("scales supplied counts, permits explicit repeats and retains zero-serving rows", () => {
    const result = tool.execute({
      ...example.input,
      recipes: [example.input.recipes[1]],
      selectionCount: 2,
      withoutReplacement: false,
      targetServings: [0],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.selections.map((s) => s.recipeId)).toEqual([
      "R2",
      "R2",
    ]);
    expect(result.output.shoppingList.every((row) => row.amount === 0)).toBe(
      true,
    );
  });
  it("rejects invalid dimensional units, duplicate densities, shortages and numeric overflow", () => {
    for (const change of [
      { selectionCount: 3 },
      {
        densities: [
          { ingredientId: "x", gramsPerMilliliter: 1 },
          { ingredientId: "x", gramsPerMilliliter: 2 },
        ],
      },
      {
        recipes: [
          {
            id: "R",
            originalServings: 1,
            ingredients: [
              { ingredientId: "x", amount: 1, dimension: "volume", unit: "kg" },
            ],
          },
        ],
      },
      { targetServings: [Number.MAX_VALUE] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
