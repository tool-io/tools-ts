import { describe, expect, it } from "vitest";
import {
  calculateRestockingFeeNetRefundComputation,
  restockingFeeNetRefundComputationExample,
  runRestockingFeeNetRefundComputation,
} from "./tool.js";

describe("logistics/restocking-fee-net-refund-computation", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runRestockingFeeNetRefundComputation(
        restockingFeeNetRefundComputationExample.input,
      ),
    ).toEqual({
      ok: true,
      output: restockingFeeNetRefundComputationExample.output,
    });
  });

  it("clamps at zero and reports a shortfall when deductions exceed the price", () => {
    expect(
      runRestockingFeeNetRefundComputation({
        flatReturnDeduction: 90,
        itemPrice: 80,
        restockingFeePercent: 10,
      }),
    ).toEqual({
      ok: true,
      output: {
        deductionShortfall: 18,
        netRefund: 0,
        restockingFeeAmount: 8,
      },
    });
  });

  it("applies its documented defaults", () => {
    expect(runRestockingFeeNetRefundComputation({ itemPrice: 100 })).toEqual({
      ok: true,
      output: {
        deductionShortfall: 0,
        netRefund: 85,
        restockingFeeAmount: 15,
      },
    });
  });

  it("rejects invalid direct and public amounts", () => {
    expect(() =>
      calculateRestockingFeeNetRefundComputation({
        flatReturnDeduction: 0,
        itemPrice: Number.NaN,
        restockingFeePercent: 15,
      }),
    ).toThrow("must be finite");
    expect(runRestockingFeeNetRefundComputation({ itemPrice: -1 }).ok).toBe(
      false,
    );
  });
});
