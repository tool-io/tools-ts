import { describe, expect, it } from "vitest";
import { calculateMortalityRate, example, runMortalityRate } from "./tool.js";

describe("aquaculture/mortality-rate", () => {
  it("calculates the published example", () => {
    expect(calculateMortalityRate(example.input)).toEqual(example.output);
    expect(runMortalityRate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runMortalityRate({
      ...example.input,
      deadAnimals: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runMortalityRate({ ...example.input, initialAnimals: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "initialAnimals" }] },
    });
  });
});
