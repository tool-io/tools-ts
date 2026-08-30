import { describe, expect, it } from "vitest";
import { calculateRandomSequentialColorScale, randomSequentialColorScaleExample, runRandomSequentialColorScale } from "./tool.js";
describe("Random Sequential Color Scale Generator", () => {
  it("returns the requested number of colors", () => { expect(JSON.parse(JSON.stringify(randomSequentialColorScaleExample))).toEqual(randomSequentialColorScaleExample);expect(runRandomSequentialColorScale(randomSequentialColorScaleExample.input,{random:()=>0}).ok).toBe(true); const output = calculateRandomSequentialColorScale({ count: 5 }, () => 0); expect(output?.colors).toHaveLength(5); expect(output?.colors.every((color) => typeof color === "string" && color.length > 0)).toBe(true); });
  it("is deterministic for injected randomness", () => { expect(calculateRandomSequentialColorScale({ count: 3 }, () => 0.25)).toEqual(calculateRandomSequentialColorScale({ count: 3 }, () => 0.25)); });
  it("rejects invalid requests", () => { expect(runRandomSequentialColorScale({ count: 1 }).ok).toBe(false); expect(runRandomSequentialColorScale({ count: 2 }, { random: () => 1 }).ok).toBe(false); expect(runRandomSequentialColorScale({ count: 2, unexpected: true }).ok).toBe(false); });
});
