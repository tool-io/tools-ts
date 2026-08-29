import { describe, expect, it } from "vitest";
import {
  calculateDisposalGainLoss,
  disposalGainLossExample,
  runDisposalGainLoss,
} from "./tool.js";

describe("disposal gain or loss", () => {
  it("executes its canonical example exactly", () => {
    expect(runDisposalGainLoss(disposalGainLossExample.input)).toEqual({
      ok: true,
      output: disposalGainLossExample.output,
    });
  });

  it("matches the OpenStax Garcia equipment case", () => {
    // Cost 150,000, accumulated 65,000 -> book 85,000. Proceeds above/below book
    // produce a gain of 10,000 at 95,000, a loss of 15,000 at 70,000, and a
    // loss of 25,000 at 60,000.
    expect(
      calculateDisposalGainLoss({
        accumulatedDepreciation: 65000,
        cost: 150000,
        saleProceeds: 95000,
      }),
    ).toEqual({ bookValue: 85000, gainOrLoss: 10000 });
    expect(
      calculateDisposalGainLoss({
        accumulatedDepreciation: 65000,
        cost: 150000,
        saleProceeds: 70000,
      }),
    ).toEqual({ bookValue: 85000, gainOrLoss: -15000 });
    expect(
      calculateDisposalGainLoss({
        accumulatedDepreciation: 65000,
        cost: 150000,
        saleProceeds: 60000,
      }),
    ).toEqual({ bookValue: 85000, gainOrLoss: -25000 });
  });

  it("reports exactly zero without negative zero at breakeven", () => {
    expect(
      calculateDisposalGainLoss({
        accumulatedDepreciation: 65000,
        cost: 150000,
        saleProceeds: 85000,
      }),
    ).toEqual({ bookValue: 85000, gainOrLoss: 0 });
    expect(
      calculateDisposalGainLoss({
        accumulatedDepreciation: 85000,
        cost: 85000,
        saleProceeds: 0,
      }),
    ).toEqual({ bookValue: 0, gainOrLoss: 0 });
  });

  it("nets fully depreciated assets at zero book value", () => {
    expect(
      calculateDisposalGainLoss({
        accumulatedDepreciation: 30000,
        cost: 30000,
        saleProceeds: 500,
      }),
    ).toEqual({ bookValue: 0, gainOrLoss: 500 });
  });

  it("rejects accumulated depreciation exceeding cost", () => {
    expect(
      runDisposalGainLoss({
        accumulatedDepreciation: 160000,
        cost: 150000,
        saleProceeds: 95000,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          {
            code: "accumulated_exceeds_cost",
            field: "accumulatedDepreciation",
          },
        ],
      },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateDisposalGainLoss({
        accumulatedDepreciation: -1,
        cost: 150000,
        saleProceeds: 95000,
      }),
    ).toThrow();
    expect(() =>
      calculateDisposalGainLoss({
        accumulatedDepreciation: 65000,
        cost: 150000,
        saleProceeds: NaN,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(
      runDisposalGainLoss({
        accumulatedDepreciation: 65000,
        saleProceeds: 95000,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "cost" }] },
    });
  });
});
