import { describe, expect, it } from "vitest";
import { calculateBiomass, example, runBiomass } from "./tool.js";

describe("aquaculture/biomass", () => {
  it("calculates the published example", () => {
    expect(calculateBiomass(example.input)).toEqual(example.output);
    expect(runBiomass(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runBiomass({ ...example.input, animalCount: Number.NaN });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateBiomass({ animalCount: 1000, meanWeightGrams: 500 })
        .biomassKilograms,
    ).toBe(500);
  });
});
