import { describe, expect, it } from "vitest";
import {
  calculateGrossProfitAmount,
  grossProfitAmountExample,
  runGrossProfitAmount,
} from "./tool.js";

describe("Gross Profit Amount Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGrossProfitAmount(grossProfitAmountExample.input)).toEqual({
      ok: true,
      output: grossProfitAmountExample.output,
    });
  });

  it("calculates a larger profit for another valid input", () => {
    expect(
      calculateGrossProfitAmount({ revenue: 5000, costOfGoodsSold: 2000 }),
    ).toEqual({ grossProfit: 3000 });
  });

  it("reports a negative profit when costs exceed revenue", () => {
    expect(
      calculateGrossProfitAmount({ revenue: 500, costOfGoodsSold: 700 }),
    ).toEqual({ grossProfit: -200 });
  });

  it("allows zero revenue and zero cost of goods sold", () => {
    expect(runGrossProfitAmount({ revenue: 0, costOfGoodsSold: 0 })).toEqual({
      ok: true,
      output: { grossProfit: 0 },
    });
  });

  it("rejects non-finite input", () => {
    const result = runGrossProfitAmount({
      revenue: Number.POSITIVE_INFINITY,
      costOfGoodsSold: 800,
    });
    expect(result).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "revenue" }] },
      ok: false,
    });
  });

  it("rejects unknown fields", () => {
    expect(
      runGrossProfitAmount({
        extra: 1,
        revenue: 1200,
        costOfGoodsSold: 800,
      }).ok,
    ).toBe(false);
  });
});
