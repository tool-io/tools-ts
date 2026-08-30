import { describe, expect, it } from "vitest";
import { calculateRandomLightPalette, randomLightPaletteExample, runRandomLightPalette } from "./tool.js";
describe("Random Light Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomLightPaletteExample))).toEqual(randomLightPaletteExample);expect(runRandomLightPalette(randomLightPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomLightPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomLightPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomLightPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomLightPalette({ count: 1 }).ok).toBe(false); expect(runRandomLightPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomLightPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
