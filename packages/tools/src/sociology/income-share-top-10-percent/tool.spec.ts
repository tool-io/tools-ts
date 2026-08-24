import { describe, expect, it } from "vitest";
import {
  calculateIncomeShareTop10Percent,
  incomeShareTop10PercentExample,
  incomeShareTop10PercentTool,
  runIncomeShareTop10Percent,
} from "./tool.js";

describe("incomeShareTop10PercentTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runIncomeShareTop10Percent(incomeShareTop10PercentExample.input),
    ).toEqual({
      ok: true,
      output: incomeShareTop10PercentExample.output,
    });
  });

  it("selects the ceiling count for a requested top fraction", () => {
    expect(
      calculateIncomeShareTop10Percent({
        incomes: [1, 2, 3, 4, 10],
        shareFraction: 0.21,
      }),
    ).toEqual({ topSharePercent: 70 });
    const result = runIncomeShareTop10Percent({
      incomes: [0, 0],
      shareFraction: 0.5,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("incomes");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(incomeShareTop10PercentExample))).toEqual(
      incomeShareTop10PercentExample,
    );
    expect(incomeShareTop10PercentTool.contractVersion).toBe(1);
    expect(incomeShareTop10PercentTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runIncomeShareTop10Percent(null).ok).toBe(false);
    expect(
      runIncomeShareTop10Percent({
        ...incomeShareTop10PercentExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
