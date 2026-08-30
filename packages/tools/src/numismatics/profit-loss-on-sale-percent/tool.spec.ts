import { describe, expect, it } from "vitest";
import {
  calculateProfitLossOnSalePercent,
  example,
  runProfitLossOnSalePercent,
} from "./tool.js";

describe("numismatics/profit-loss-on-sale-percent", () => {
  it("calculates the published example", () => {
    expect(calculateProfitLossOnSalePercent(example.input)).toEqual(
      example.output,
    );
    expect(runProfitLossOnSalePercent(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runProfitLossOnSalePercent({
      ...example.input,
      saleProceeds: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runProfitLossOnSalePercent({ ...example.input, totalCost: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "totalCost" }] },
    });
  });
});
