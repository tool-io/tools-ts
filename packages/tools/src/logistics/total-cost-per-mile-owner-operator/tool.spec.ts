import { describe, expect, it } from "vitest";
import {
  calculateTotalCostPerMileOwnerOperator,
  totalCostPerMileOwnerOperatorExample,
  runTotalCostPerMileOwnerOperator,
} from "./tool.js";

describe("total-cost-per-mile-owner-operator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTotalCostPerMileOwnerOperator(
        totalCostPerMileOwnerOperatorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: totalCostPerMileOwnerOperatorExample.output,
    });
  });

  it("handles fractional cents per mile", () => {
    expect(
      runTotalCostPerMileOwnerOperator({
        fixedCostsUsd: 1000,
        milesDriven: 3000,
        variableCostsUsd: 2000,
      }),
    ).toEqual({ ok: true, output: { costPerMileUsd: 1, totalCostUsd: 3000 } });
  });

  it("rejects zero miles", () => {
    expect(
      runTotalCostPerMileOwnerOperator({
        fixedCostsUsd: 1000,
        milesDriven: 0,
        variableCostsUsd: 500,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite and overflowing costs", () => {
    expect(() =>
      calculateTotalCostPerMileOwnerOperator({
        fixedCostsUsd: Number.NaN,
        milesDriven: 100,
        variableCostsUsd: 50,
      }),
    ).toThrow("must be finite");
    expect(() =>
      calculateTotalCostPerMileOwnerOperator({
        fixedCostsUsd: Number.MAX_VALUE,
        milesDriven: 100,
        variableCostsUsd: Number.MAX_VALUE,
      }),
    ).toThrow("outside the representable range");
  });
});
