import { describe, expect, it } from "vitest";
import { calculateRandomNeutralPalette, randomNeutralPaletteExample, runRandomNeutralPalette } from "./tool.js";
describe("Random Neutral Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomNeutralPaletteExample))).toEqual(randomNeutralPaletteExample);expect(runRandomNeutralPalette(randomNeutralPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomNeutralPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomNeutralPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomNeutralPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomNeutralPalette({ count: 1 }).ok).toBe(false); expect(runRandomNeutralPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomNeutralPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
