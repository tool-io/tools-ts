import { describe, expect, it } from "vitest";
import { calculateRandomAnalogousPalette, randomAnalogousPaletteExample, runRandomAnalogousPalette } from "./tool.js";
describe("Random Analogous Palette Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomAnalogousPaletteExample))).toEqual(randomAnalogousPaletteExample);expect(runRandomAnalogousPalette(randomAnalogousPaletteExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomAnalogousPalette({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomAnalogousPalette({ count: 3 }, () => 0.25)).toEqual(calculateRandomAnalogousPalette({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomAnalogousPalette({ count: 1 }).ok).toBe(false); expect(runRandomAnalogousPalette({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomAnalogousPalette({ count: 2, unexpected: true }).ok).toBe(false); });
});
