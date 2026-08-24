import { describe, expect, it } from "vitest";
import { noiExample, runNoi } from "./tool.js";

describe("real-estate/noi", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runNoi(noiExample.input)).toEqual({
      ok: true,
      output: noiExample.output,
    });
  });

  it("defaults to five percent vacancy and no other income", () => {
    const result = runNoi({
      grossScheduledIncomeUsd: 100000,
      operatingExpensesUsd: 40000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.vacancyLossUsd as number).toBe(5000);
    expect(result.output.netOperatingIncomeUsd as number).toBe(55000);
  });

  it("rejects negative income and out-of-range vacancy", () => {
    expect(
      runNoi({ grossScheduledIncomeUsd: -1, operatingExpensesUsd: 40000 }).ok,
    ).toBe(false);
    expect(
      runNoi({
        grossScheduledIncomeUsd: 100000,
        vacancyAndCreditLossPercent: 120,
        operatingExpensesUsd: 40000,
      }).ok,
    ).toBe(false);
  });
});
