import { describe, expect, it } from "vitest";
import { calculateRandomEarthTonePalette, randomEarthTonePaletteExample, runRandomEarthTonePalette } from "./tool.js";
describe("Random Earth Tone Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomEarthTonePaletteExample))).toEqual(randomEarthTonePaletteExample);expect(runRandomEarthTonePalette(randomEarthTonePaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomEarthTonePalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomEarthTonePalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomEarthTonePalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomEarthTonePalette({ count: 1 }).ok).toBe(false); expect(runRandomEarthTonePalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomEarthTonePalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
