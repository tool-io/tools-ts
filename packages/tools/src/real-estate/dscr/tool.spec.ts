import { describe, expect, it } from "vitest";
import { dscrExample, runDscr } from "./tool.js";

describe("real-estate/dscr", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDscr(dscrExample.input)).toEqual({
      ok: true,
      output: dscrExample.output,
    });
  });

  it("equals one when NOI just covers the debt service", () => {
    const result = runDscr({
      annualNetOperatingIncomeUsd: 95000,
      annualDebtServiceUsd: 95000,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.debtServiceCoverageRatio as number).toBe(1);
  });

  it("rejects non-positive debt service", () => {
    expect(
      runDscr({ annualNetOperatingIncomeUsd: 123000, annualDebtServiceUsd: 0 })
        .ok,
    ).toBe(false);
  });
});
