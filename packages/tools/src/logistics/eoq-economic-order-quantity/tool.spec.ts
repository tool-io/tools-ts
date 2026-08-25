import { describe, expect, it } from "vitest";
import {
  calculateEoqEconomicOrderQuantity,
  eoqEconomicOrderQuantityExample,
  runEoqEconomicOrderQuantity,
} from "./tool.js";

describe("eoq-economic-order-quantity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEoqEconomicOrderQuantity(eoqEconomicOrderQuantityExample.input),
    ).toEqual({
      ok: true,
      output: eoqEconomicOrderQuantityExample.output,
    });
  });

  it("returns a whole square root cleanly", () => {
    expect(
      runEoqEconomicOrderQuantity({
        annualDemandUnits: 800,
        holdingCostPerUnitYearUsd: 2,
        orderCostPerOrderUsd: 50,
      }),
    ).toEqual({
      ok: true,
      output: { economicOrderQuantityUnits: 200, ordersPerYear: 4 },
    });
  });

  it("rejects non-positive holding cost", () => {
    expect(
      runEoqEconomicOrderQuantity({
        annualDemandUnits: 1000,
        holdingCostPerUnitYearUsd: 0,
        orderCostPerOrderUsd: 40,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite annual demand", () => {
    expect(() =>
      calculateEoqEconomicOrderQuantity({
        annualDemandUnits: Number.NaN,
        holdingCostPerUnitYearUsd: 2,
        orderCostPerOrderUsd: 50,
      }),
    ).toThrow("must be finite");
  });
});
