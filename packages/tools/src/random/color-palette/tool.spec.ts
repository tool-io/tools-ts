import { describe, expect, it } from "vitest";
import { calculateRandomColorPalette, hslToHex, randomColorPaletteExample, runRandomColorPalette } from "./tool.js";

describe("Random Color Palette Generator", () => {
  it("generates the requested number of portable hex colors", () => {
    expect(JSON.parse(JSON.stringify(randomColorPaletteExample))).toEqual(randomColorPaletteExample);expect(runRandomColorPalette(randomColorPaletteExample.input,{random:()=>0}).ok).toBe(true);
    expect(calculateRandomColorPalette({ count: 3 }, () => 0)).toEqual({ colors: ["#562929", "#562929", "#562929"] });
    expect(hslToHex(0, 100, 50)).toBe("#FF0000");
  });
  it("is deterministic with injected randomness", () => {
    expect(calculateRandomColorPalette({ count: 4 }, () => 0.5)).toEqual(calculateRandomColorPalette({ count: 4 }, () => 0.5));
  });
  it("rejects invalid counts, randomness, and fields", () => {
    expect(runRandomColorPalette({ count: 1 }).ok).toBe(false);
    expect(runRandomColorPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false);
    expect(runRandomColorPalette({ count: 2, unexpected: true }).ok).toBe(false);
  });
});
