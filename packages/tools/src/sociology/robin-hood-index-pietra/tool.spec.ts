import { describe, expect, it } from "vitest";
import {
  calculateRobinHoodIndex,
  robinHoodIndexPietraExample,
  robinHoodIndexPietraTool,
  runRobinHoodIndexPietra,
} from "./tool.js";

describe("robinHoodIndexPietraTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runRobinHoodIndexPietra(robinHoodIndexPietraExample.input)).toEqual({
      ok: true,
      output: robinHoodIndexPietraExample.output,
    });
  });

  it("is zero for equal incomes and rejects negative income values", () => {
    expect(calculateRobinHoodIndex({ incomes: [5, 5, 5] })).toEqual({
      robinHoodIndex: 0,
    });
    const result = runRobinHoodIndexPietra({ incomes: [-1, 2, 3] });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("incomes");
  });

  it("equals half the mean absolute deviation share of the mean", () => {
    // [1,2,3,4,10]: mean 4, total absolute deviation 12, index 12/(2*5*4) = 0.3.
    expect(
      calculateRobinHoodIndex({ incomes: [1, 2, 3, 4, 10] }).robinHoodIndex,
    ).toBe(0.3);
    expect(
      calculateRobinHoodIndex({ incomes: [2, 2, 2, 2] }).robinHoodIndex,
    ).toBe(0);
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(robinHoodIndexPietraExample))).toEqual(
      robinHoodIndexPietraExample,
    );
    expect(robinHoodIndexPietraTool.contractVersion).toBe(1);
    expect(robinHoodIndexPietraTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runRobinHoodIndexPietra(null).ok).toBe(false);
    expect(
      runRobinHoodIndexPietra({
        ...robinHoodIndexPietraExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
