import { describe, expect, it } from "vitest";
import {
  buildStockFlowBathtubDiagram,
  runStockFlowBathtub,
  stockFlowBathtubExample,
} from "./tool.js";

describe("stock-flow bathtub intuition diagram builder", () => {
  it("reproduces its canonical example", () => {
    expect(runStockFlowBathtub(stockFlowBathtubExample.input)).toEqual({
      ok: true,
      output: stockFlowBathtubExample.output,
    });
  });

  it("calculates stock growth under positive net flow", () => {
    expect(
      buildStockFlowBathtubDiagram({
        initialStock: 10,
        inflowLabel: "In",
        netFlowPerPeriod: 5,
        outflowLabel: "Out",
        periods: 2,
        stockLabel: "Stock",
      }).endingStock,
    ).toBe(20);
  });

  it("returns a zero stock-flow ratio for zero net flow", () => {
    expect(
      buildStockFlowBathtubDiagram({
        initialStock: 10,
        inflowLabel: "In",
        netFlowPerPeriod: 0,
        outflowLabel: "Out",
        periods: 2,
        stockLabel: "Stock",
      }).stockToNetFlowRatio,
    ).toBe(0);
  });

  it("rejects a negative ending stock", () => {
    expect(
      runStockFlowBathtub({
        initialStock: 10,
        inflowLabel: "In",
        netFlowPerPeriod: -10,
        outflowLabel: "Out",
        periods: 2,
        stockLabel: "Stock",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_ending_stock" }] },
      ok: false,
    });
  });
});
