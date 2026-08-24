import { describe, expect, it } from "vitest";
import {
  calculateNegotiatedDiscountOffInvoicePercent,
  negotiatedDiscountOffInvoicePercentExample,
  runNegotiatedDiscountOffInvoicePercent,
} from "./tool.js";

describe("negotiated-discount-off-invoice-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runNegotiatedDiscountOffInvoicePercent(
        negotiatedDiscountOffInvoicePercentExample.input,
      ),
    ).toEqual({
      ok: true,
      output: negotiatedDiscountOffInvoicePercentExample.output,
    });
  });

  it("returns the full invoice for a zero percent discount", () => {
    expect(
      runNegotiatedDiscountOffInvoicePercent({
        invoiceTotalUsd: 990.1,
        discountPercent: 0,
      }),
    ).toEqual({
      ok: true,
      output: { discountAmountUsd: 0, netPayableUsd: 990.1 },
    });
  });

  it("allows a full discount", () => {
    expect(
      calculateNegotiatedDiscountOffInvoicePercent({
        discountPercent: 100,
        invoiceTotalUsd: 500,
      }),
    ).toEqual({ discountAmountUsd: 500, netPayableUsd: 0 });
  });

  it("rejects out-of-range and non-finite inputs", () => {
    expect(
      runNegotiatedDiscountOffInvoicePercent({
        invoiceTotalUsd: 500,
        discountPercent: 120,
      }).ok,
    ).toBe(false);
    expect(() =>
      calculateNegotiatedDiscountOffInvoicePercent({
        discountPercent: Number.NaN,
        invoiceTotalUsd: 500,
      }),
    ).toThrow("between zero and one hundred");
  });
});
