import { describe, expect, it } from "vitest";
import { calculateRandomTriadicPalette, randomTriadicPaletteExample, runRandomTriadicPalette } from "./tool.js";
describe("Random Triadic Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomTriadicPaletteExample))).toEqual(randomTriadicPaletteExample);expect(runRandomTriadicPalette(randomTriadicPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomTriadicPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomTriadicPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomTriadicPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomTriadicPalette({ count: 1 }).ok).toBe(false); expect(runRandomTriadicPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomTriadicPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
