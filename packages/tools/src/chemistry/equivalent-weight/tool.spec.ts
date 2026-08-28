import { describe, expect, it } from "vitest";
import { runEquivalentWeight } from "./tool.js";

describe("Equivalent Weight Calculator", () => {
  it("calculates a valid result", () => {
    expect(runEquivalentWeight({ molarMassGMol: 98, valence: 2 })).toEqual({
      ok: true,
      output: { equivalentWeightGMol: 49 },
    });
  });

  it("rejects invalid input", () =>
    expect(runEquivalentWeight(null).ok).toBe(false));
});
