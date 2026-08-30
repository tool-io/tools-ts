import { describe, expect, it } from "vitest";
import { calculateRandomDarkPalette, randomDarkPaletteExample, runRandomDarkPalette } from "./tool.js";
describe("Random Dark Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomDarkPaletteExample))).toEqual(randomDarkPaletteExample);expect(runRandomDarkPalette(randomDarkPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomDarkPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomDarkPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomDarkPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomDarkPalette({ count: 1 }).ok).toBe(false); expect(runRandomDarkPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomDarkPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
