import { describe, expect, it } from "vitest";
import {
  performThreeWayMatch,
  runThreeWayMatch,
  threeWayMatchExample,
} from "./tool.js";

describe("three-way match PO GRN invoice test", () => {
  it("reproduces its canonical example", () => {
    expect(runThreeWayMatch(threeWayMatchExample.input)).toEqual({
      ok: true,
      output: threeWayMatchExample.output,
    });
  });

  it("accepts an invoice inside tolerance", () => {
    expect(
      performThreeWayMatch({
        tolerancePercent: 1,
        values: {
          goodsReceived: { quantity: 10 },
          invoice: { amount: 126, quantity: 10 },
          purchaseOrder: { quantity: 10, unitPrice: 12.5 },
        },
      }),
    ).toMatchObject({ matched: true, reasons: [] });
  });

  it("reports each failed field test with a stable reason", () => {
    const result = performThreeWayMatch({
      tolerancePercent: 0,
      values: {
        goodsReceived: { quantity: 9 },
        invoice: { amount: 140, quantity: 9 },
        purchaseOrder: { quantity: 10, unitPrice: 12.5 },
      },
    });
    expect(result).toMatchObject({
      invoiceVsPoAmountDelta: 15,
      invoiceVsPoQuantityDelta: -1,
      matched: false,
      receivedVsPoQuantityDelta: -1,
    });
    expect(result.reasons).toEqual([
      "goods_received_quantity_differs_from_purchase_order",
      "invoice_quantity_differs_from_purchase_order",
      "invoice_amount_outside_tolerance",
    ]);
  });

  it("computes an independently known extended price", () => {
    const result = performThreeWayMatch({
      tolerancePercent: 0,
      values: {
        goodsReceived: { quantity: 3 },
        invoice: { amount: 59.85, quantity: 3 },
        purchaseOrder: { quantity: 3, unitPrice: 19.95 },
      },
    });
    expect(result.matched).toBe(true);
    expect(result.invoiceVsPoAmountDelta).toBeCloseTo(0, 12);
    expect(result.invoiceVsPoAmountDelta).not.toBe(0);
  });

  it("rejects a negative tolerance", () => {
    expect(
      runThreeWayMatch({
        tolerancePercent: -1,
        values: {
          goodsReceived: { quantity: 1 },
          invoice: { amount: 1, quantity: 1 },
          purchaseOrder: { quantity: 1, unitPrice: 1 },
        },
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_tolerance", field: "tolerancePercent" }],
      },
      ok: false,
    });
  });

  it("rejects negative quantities before matching documents", () => {
    expect(
      runThreeWayMatch({
        tolerancePercent: 0,
        values: {
          goodsReceived: { quantity: -1 },
          invoice: { amount: 10, quantity: 1 },
          purchaseOrder: { quantity: 1, unitPrice: 10 },
        },
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          {
            code: "nonnegative_value_required",
            field: "values.goodsReceived.quantity",
          },
        ],
      },
    });
  });

  it("preserves full precision instead of rounding deltas to cents", () => {
    expect(
      performThreeWayMatch({
        tolerancePercent: 100,
        values: {
          goodsReceived: { quantity: 1.125 },
          invoice: { amount: 2.375, quantity: 1.25 },
          purchaseOrder: { quantity: 1, unitPrice: 2.25 },
        },
      }),
    ).toMatchObject({
      invoiceVsPoAmountDelta: 0.125,
      invoiceVsPoQuantityDelta: 0.25,
      receivedVsPoQuantityDelta: 0.125,
    });
  });

  it("rejects a non-finite nested amount with its exact field", () => {
    expect(
      runThreeWayMatch({
        tolerancePercent: 0,
        values: {
          goodsReceived: { quantity: 1 },
          invoice: { amount: Number.POSITIVE_INFINITY, quantity: 1 },
          purchaseOrder: { quantity: 1, unitPrice: 1 },
        },
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "finite_number_required",
            field: "values.invoice.amount",
          },
        ],
      },
      ok: false,
    });
  });
});
