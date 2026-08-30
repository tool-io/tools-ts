import { describe, expect, it } from "vitest";
import { calculateRandomPastelPalette, randomPastelPaletteExample, runRandomPastelPalette } from "./tool.js";
describe("Random Pastel Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomPastelPaletteExample))).toEqual(randomPastelPaletteExample);expect(runRandomPastelPalette(randomPastelPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomPastelPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomPastelPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomPastelPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomPastelPalette({ count: 1 }).ok).toBe(false); expect(runRandomPastelPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomPastelPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
