import { describe, expect, it } from "vitest";
import { calculateRandomVividPalette, randomVividPaletteExample, runRandomVividPalette } from "./tool.js";
describe("Random Vivid Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomVividPaletteExample))).toEqual(randomVividPaletteExample);expect(runRandomVividPalette(randomVividPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomVividPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomVividPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomVividPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomVividPalette({ count: 1 }).ok).toBe(false); expect(runRandomVividPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomVividPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
