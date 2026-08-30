import { describe, expect, it } from "vitest";
import { calculateRandomMonochromaticPalette, randomMonochromaticPaletteExample, runRandomMonochromaticPalette } from "./tool.js";
describe("Random Monochromatic Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomMonochromaticPaletteExample))).toEqual(randomMonochromaticPaletteExample);expect(runRandomMonochromaticPalette(randomMonochromaticPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomMonochromaticPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomMonochromaticPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomMonochromaticPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomMonochromaticPalette({ count: 1 }).ok).toBe(false); expect(runRandomMonochromaticPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomMonochromaticPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
