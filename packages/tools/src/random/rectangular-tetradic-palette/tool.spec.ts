import { describe, expect, it } from "vitest";
import { calculateRandomRectangularTetradicPalette, randomRectangularTetradicPaletteExample, runRandomRectangularTetradicPalette } from "./tool.js";
describe("Random Rectangular Tetradic Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomRectangularTetradicPaletteExample))).toEqual(randomRectangularTetradicPaletteExample);expect(runRandomRectangularTetradicPalette(randomRectangularTetradicPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomRectangularTetradicPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomRectangularTetradicPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomRectangularTetradicPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomRectangularTetradicPalette({ count: 1 }).ok).toBe(false); expect(runRandomRectangularTetradicPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomRectangularTetradicPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
