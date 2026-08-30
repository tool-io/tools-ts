import { describe, expect, it } from "vitest";
import { calculateRandomWarmPalette, randomWarmPaletteExample, runRandomWarmPalette } from "./tool.js";
describe("Random Warm Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomWarmPaletteExample))).toEqual(randomWarmPaletteExample);expect(runRandomWarmPalette(randomWarmPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomWarmPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomWarmPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomWarmPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomWarmPalette({ count: 1 }).ok).toBe(false); expect(runRandomWarmPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomWarmPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
