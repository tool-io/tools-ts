import { describe, expect, it } from "vitest";
import { calculateRandomComplementaryPalette, randomComplementaryPaletteExample, runRandomComplementaryPalette } from "./tool.js";
describe("Random Complementary Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomComplementaryPaletteExample))).toEqual(randomComplementaryPaletteExample);expect(runRandomComplementaryPalette(randomComplementaryPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomComplementaryPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomComplementaryPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomComplementaryPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomComplementaryPalette({ count: 1 }).ok).toBe(false); expect(runRandomComplementaryPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomComplementaryPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
