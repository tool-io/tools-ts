import { describe, expect, it } from "vitest";
import { calculateRandomDivergingColorScale, randomDivergingColorScaleExample, runRandomDivergingColorScale } from "./tool.js";
describe("Random Diverging Color Scale Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomDivergingColorScaleExample))).toEqual(randomDivergingColorScaleExample);expect(runRandomDivergingColorScale(randomDivergingColorScaleExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomDivergingColorScale({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomDivergingColorScale({ count: 3 }, () => 0.25)).toEqual(calculateRandomDivergingColorScale({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomDivergingColorScale({ count: 1 }).ok).toBe(false); expect(runRandomDivergingColorScale({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomDivergingColorScale({ count: 2, unexpected: true }).ok).toBe(false); });
});
