import { describe, expect, it } from "vitest";
import { calculateRandomEvenlySpacedHuePalette, randomEvenlySpacedHuePaletteExample, runRandomEvenlySpacedHuePalette } from "./tool.js";
describe("Random Evenly Spaced Hue Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomEvenlySpacedHuePaletteExample))).toEqual(randomEvenlySpacedHuePaletteExample);expect(runRandomEvenlySpacedHuePalette(randomEvenlySpacedHuePaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomEvenlySpacedHuePalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomEvenlySpacedHuePalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomEvenlySpacedHuePalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomEvenlySpacedHuePalette({ count: 1 }).ok).toBe(false); expect(runRandomEvenlySpacedHuePalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomEvenlySpacedHuePalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
