import { describe, expect, it } from "vitest";
import { calculateRandomSplitComplementaryPalette, randomSplitComplementaryPaletteExample, runRandomSplitComplementaryPalette } from "./tool.js";
describe("Random Split-Complementary Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomSplitComplementaryPaletteExample))).toEqual(randomSplitComplementaryPaletteExample);expect(runRandomSplitComplementaryPalette(randomSplitComplementaryPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomSplitComplementaryPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomSplitComplementaryPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomSplitComplementaryPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomSplitComplementaryPalette({ count: 1 }).ok).toBe(false); expect(runRandomSplitComplementaryPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomSplitComplementaryPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
