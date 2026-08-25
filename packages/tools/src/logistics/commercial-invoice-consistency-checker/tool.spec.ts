import { describe, expect, it } from "vitest";
import {
  calculateCommercialInvoiceConsistencyChecker,
  commercialInvoiceConsistencyCheckerExample,
  runCommercialInvoiceConsistencyChecker,
} from "./tool.js";

describe("logistics/commercial-invoice-consistency-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCommercialInvoiceConsistencyChecker(
        commercialInvoiceConsistencyCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: commercialInvoiceConsistencyCheckerExample.output,
    });
  });

  it("flags mismatched quantity and inverted weights", () => {
    const result = runCommercialInvoiceConsistencyChecker({
      customsDeclaredValue: 5200,
      grossWeightKg: 280,
      invoiceQuantity: 240,
      invoiceValue: 5200,
      netWeightKg: 300,
      shippedQuantity: 255,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.fullyConsistent).toBe(false);
    expect(result.output.issues).toHaveLength(2);
  });

  it("rejects a zero invoice value", () => {
    expect(
      runCommercialInvoiceConsistencyChecker({
        customsDeclaredValue: 10,
        grossWeightKg: 1,
        invoiceQuantity: 1,
        invoiceValue: 0,
        netWeightKg: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects fractional quantities and non-finite values", () => {
    const base = {
      customsDeclaredValue: 10,
      grossWeightKg: 1,
      invoiceQuantity: 1,
      invoiceValue: 10,
      netWeightKg: 1,
      shippedQuantity: 1,
    };
    expect(() =>
      calculateCommercialInvoiceConsistencyChecker({
        ...base,
        invoiceQuantity: 1.5,
      }),
    ).toThrow("whole numbers");
    expect(() =>
      calculateCommercialInvoiceConsistencyChecker({
        ...base,
        customsDeclaredValue: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite");
  });
});
