import { describe, expect, it } from "vitest";
import { calculateRandomMutedPalette, randomMutedPaletteExample, runRandomMutedPalette } from "./tool.js";
describe("Random Muted Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomMutedPaletteExample))).toEqual(randomMutedPaletteExample);expect(runRandomMutedPalette(randomMutedPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomMutedPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomMutedPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomMutedPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomMutedPalette({ count: 1 }).ok).toBe(false); expect(runRandomMutedPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomMutedPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
