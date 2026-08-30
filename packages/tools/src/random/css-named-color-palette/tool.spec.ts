import { describe, expect, it } from "vitest";
import { calculateRandomCssNamedColorPalette, randomCssNamedColorPaletteExample, runRandomCssNamedColorPalette } from "./tool.js";
describe("Random CSS Named Color Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomCssNamedColorPaletteExample))).toEqual(randomCssNamedColorPaletteExample);expect(runRandomCssNamedColorPalette(randomCssNamedColorPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomCssNamedColorPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomCssNamedColorPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomCssNamedColorPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomCssNamedColorPalette({ count: 1 }).ok).toBe(false); expect(runRandomCssNamedColorPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomCssNamedColorPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
