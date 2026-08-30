import { describe, expect, it } from "vitest";
import {
  revenueCutVouchingExample,
  runRevenueCutVouching,
  testRevenueCutVouching,
} from "./tool.js";

describe("revenue cut shipping invoice vouching", () => {
  it("reproduces its canonical example", () => {
    expect(runRevenueCutVouching(revenueCutVouchingExample.input)).toEqual({
      ok: true,
      output: revenueCutVouchingExample.output,
    });
  });

  it("accepts a matched transaction invoiced before shipment", () => {
    expect(
      testRevenueCutVouching({ transactions: [[1, 1, 1, 0]] }).issueCount,
    ).toBe(0);
  });

  it("flags a transaction missing a shipping date", () => {
    expect(
      testRevenueCutVouching({ transactions: [[0, 1, 1, 0]] }).issueIndices,
    ).toEqual([0]);
  });

  it("rejects a malformed transaction row", () => {
    expect(runRevenueCutVouching({ transactions: [[1, 1, 1]] })).toMatchObject({
      error: {
        issues: [{ code: "invalid_transaction_row", field: "transactions.0" }],
      },
      ok: false,
    });
  });
});
