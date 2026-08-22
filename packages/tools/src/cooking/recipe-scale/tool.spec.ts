import { describe, expect, it } from "vitest";
import { runRecipeScale } from "./tool.js";

describe("Recipe Scale Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runRecipeScale({
        amount: 200,
        newServings: 4,
        originalServings: 2,
      }),
    ).toEqual({
      ok: true,
      output: { scaledAmount: 400 },
    });
  });

  it("supports shrinking a recipe", () => {
    expect(
      runRecipeScale({
        amount: 300,
        newServings: 1,
        originalServings: 3,
      }),
    ).toEqual({
      ok: true,
      output: { scaledAmount: 100 },
    });
  });

  it("rejects invalid input", () =>
    expect(runRecipeScale(null).ok).toBe(false));
});
