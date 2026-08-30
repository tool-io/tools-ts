import { describe, expect, it } from "vitest";
import { calculateRandomSquareHarmonyPalette, randomSquareHarmonyPaletteExample, runRandomSquareHarmonyPalette } from "./tool.js";
describe("Random Square Harmony Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomSquareHarmonyPaletteExample))).toEqual(randomSquareHarmonyPaletteExample);expect(runRandomSquareHarmonyPalette(randomSquareHarmonyPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomSquareHarmonyPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomSquareHarmonyPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomSquareHarmonyPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomSquareHarmonyPalette({ count: 1 }).ok).toBe(false); expect(runRandomSquareHarmonyPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomSquareHarmonyPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
