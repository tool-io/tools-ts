import { describe, expect, it } from "vitest";
import { calculateRandomGrayscalePalette, randomGrayscalePaletteExample, runRandomGrayscalePalette } from "./tool.js";
describe("Random Grayscale Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomGrayscalePaletteExample))).toEqual(randomGrayscalePaletteExample);expect(runRandomGrayscalePalette(randomGrayscalePaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomGrayscalePalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomGrayscalePalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomGrayscalePalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomGrayscalePalette({ count: 1 }).ok).toBe(false); expect(runRandomGrayscalePalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomGrayscalePalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
