import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateMacronutrientSplit,
  macronutrientSplitExample,
  macronutrientSplitTool,
} from "./tool.js";

describe("Macronutrient Split", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = macronutrientSplitTool.execute(
      macronutrientSplitExample.input,
    );
    expect(result).toEqual({
      ok: true,
      output: macronutrientSplitExample.output,
    });
  });

  it("publishes a valid pure tool contract", () => {
    expect(macronutrientSplitTool.id).toBe("nutrition/macronutrient-split");
    expect(validateToolContract(macronutrientSplitTool)).toEqual([]);
  });

  it("uses 4/4/9 kilocalories per gram", () => {
    const clean = calculateMacronutrientSplit({
      calories: 1800,
      carbohydratePercent: 40,
      fatPercent: 30,
      proteinPercent: 30,
    });
    expect(clean.ok).toBe(true);
    if (clean.ok) {
      // 540 kcal protein / 4, 720 / 4, 540 / 9.
      expect(clean.output.proteinGrams).toBe(135);
      expect(clean.output.carbohydrateGrams).toBe(180);
      expect(clean.output.fatGrams).toBe(60);
    }
  });

  it("rejects splits that do not sum to 100 percent", () => {
    const result = calculateMacronutrientSplit({
      calories: 2000,
      carbohydratePercent: 40,
      fatPercent: 30,
      proteinPercent: 20,
    });
    expect(result).toMatchObject({ error: { code: "invalid_input" } });
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("percent_sum_invalid");
  });

  it("rejects malformed probes", () => {
    expect(calculateMacronutrientSplit(null).ok).toBe(false);
    expect(calculateMacronutrientSplit({})).toMatchObject({
      error: { issues: { length: 4 } },
    });
    expect(
      calculateMacronutrientSplit({
        calories: -5,
        carbohydratePercent: 40,
        fatPercent: 30,
        proteinPercent: 30,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateMacronutrientSplit({
        calories: 2000,
        carbohydratePercent: 120,
        fatPercent: -20,
        proteinPercent: 0,
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateMacronutrientSplit({ extra: 1 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
