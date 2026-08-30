import { describe, expect, it } from "vitest";
import {
  countMorphologicalCombinations,
  morphologicalCombinationExample,
  runMorphologicalCombination,
} from "./tool.js";

describe("morphological box-grid combinations", () => {
  it("reproduces its canonical example", () => {
    expect(
      runMorphologicalCombination(morphologicalCombinationExample.input),
    ).toEqual({
      ok: true,
      output: morphologicalCombinationExample.output,
    });
  });

  it("multiplies dimensions with one option", () => {
    expect(
      countMorphologicalCombinations({
        dimensionLabels: ["A", "B"],
        maximumCombinations: 10,
        optionCounts: [1, 4],
      }).totalCombinations,
    ).toBe(4);
  });

  it("rejects a combination total above the explicit limit", () => {
    expect(
      runMorphologicalCombination({
        dimensionLabels: ["A", "B"],
        maximumCombinations: 10,
        optionCounts: [4, 4],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "combination_limit_exceeded", field: "optionCounts.1" },
        ],
      },
      ok: false,
    });
  });

  it("rejects mismatched dimensions and counts", () => {
    expect(
      runMorphologicalCombination({
        dimensionLabels: ["A"],
        maximumCombinations: 10,
        optionCounts: [2, 3],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "dimension_data_length_mismatch", field: "optionCounts" },
        ],
      },
      ok: false,
    });
  });
});
