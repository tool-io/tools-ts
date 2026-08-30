import { describe, expect, it } from "vitest";
import { calculateRandomCoolPalette, randomCoolPaletteExample, runRandomCoolPalette } from "./tool.js";
describe("Random Cool Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomCoolPaletteExample))).toEqual(randomCoolPaletteExample);expect(runRandomCoolPalette(randomCoolPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomCoolPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomCoolPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomCoolPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomCoolPalette({ count: 1 }).ok).toBe(false); expect(runRandomCoolPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomCoolPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
