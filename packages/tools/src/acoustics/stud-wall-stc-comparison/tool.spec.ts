import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import tool, {
  calculateDoubleStudVsSingleStudDecouplingCompareLookup,
  example,
} from "./tool.js";

describe("acoustics/stud-wall-stc-comparison", () => {
  it("executes its canonical example exactly", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
  });

  it("preserves the signed STC difference", () => {
    const row = example.input.comparisons[0];
    expect(
      calculateDoubleStudVsSingleStudDecouplingCompareLookup({
        comparisons: [{ ...row, doubleStudStc: 50, singleStudStc: 55 }],
        queryComparisonId: row.comparisonId,
      }),
    ).toMatchObject({
      higherRatedConfiguration: "single-stud",
      stcDifferencePoints: -5,
    });
  });

  it("rejects duplicate comparison identifiers", () => {
    expect(
      tool.execute({
        comparisons: [
          example.input.comparisons[0],
          example.input.comparisons[0],
        ],
        queryComparisonId: "published-examples",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "duplicate_comparison_id", field: "comparisons" }],
      },
      ok: false,
    });
  });
});
