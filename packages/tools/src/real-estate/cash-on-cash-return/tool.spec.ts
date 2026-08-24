import { describe, expect, it } from "vitest";
import { cashOnCashReturnExample, runCashOnCashReturn } from "./tool.js";

describe("real-estate/cash-on-cash-return", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runCashOnCashReturn(cashOnCashReturnExample.input)).toEqual({
      ok: true,
      output: cashOnCashReturnExample.output,
    });
  });

  it("returns zero percent when the deal breaks even on cash flow", () => {
    const result = runCashOnCashReturn({
      annualPreTaxCashFlowUsd: 0,
      totalCashInvestedUsd: 450000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.cashOnCashReturnPercent as number).toBe(0);
  });

  it("rejects non-positive invested capital", () => {
    expect(
      runCashOnCashReturn({
        annualPreTaxCashFlowUsd: 36000,
        totalCashInvestedUsd: 0,
      }).ok,
    ).toBe(false);
  });
});
