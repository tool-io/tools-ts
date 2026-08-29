import { describe, expect, it } from "vitest";
import {
  apicIssuanceExample,
  calculateApicIssuance,
  runApicIssuance,
} from "./tool.js";

describe("APIC excess par share issuance", () => {
  it("executes its canonical example exactly", () => {
    expect(runApicIssuance(apicIssuanceExample.input)).toEqual({
      ok: true,
      output: apicIssuanceExample.output,
    });
  });

  it("matches the OpenStax known split", () => {
    // 10,000 shares at $20 with $5 par: 50,000 to common stock,
    // 150,000 to APIC, 200,000 total proceeds.
    expect(
      calculateApicIssuance({
        issuePricePerShare: 20,
        parValuePerShare: 5,
        sharesIssued: 10000,
      }),
    ).toEqual({
      additionalPaidInCapital: 150000,
      commonStockAtPar: 50000,
      totalProceeds: 200000,
    });
  });

  it("splits par and APIC so their sum equals proceeds", () => {
    const result = calculateApicIssuance({
      issuePricePerShare: 12.5,
      parValuePerShare: 0.01,
      sharesIssued: 4000000,
    });
    expect(result.totalProceeds).toBe(50000000);
    expect(result.commonStockAtPar).toBe(40000);
    expect(result.additionalPaidInCapital).toBe(49960000);
    expect(result.commonStockAtPar + result.additionalPaidInCapital).toBe(
      result.totalProceeds,
    );
  });

  it("books everything to par at issuance at par", () => {
    expect(
      calculateApicIssuance({
        issuePricePerShare: 1,
        parValuePerShare: 1,
        sharesIssued: 500,
      }),
    ).toEqual({
      additionalPaidInCapital: 0,
      commonStockAtPar: 500,
      totalProceeds: 500,
    });
  });

  it("handles a no-par stock with zero par value", () => {
    expect(
      calculateApicIssuance({
        issuePricePerShare: 8,
        parValuePerShare: 0,
        sharesIssued: 1000,
      }),
    ).toEqual({
      additionalPaidInCapital: 8000,
      commonStockAtPar: 0,
      totalProceeds: 8000,
    });
  });

  it("rejects fractional shares at the schema boundary", () => {
    expect(
      runApicIssuance({
        issuePricePerShare: 20,
        parValuePerShare: 5,
        sharesIssued: 100.5,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "sharesIssued" }] },
    });
  });

  it("rejects below-par issuance rather than returning negative APIC", () => {
    expect(
      runApicIssuance({
        issuePricePerShare: 4,
        parValuePerShare: 5,
        sharesIssued: 100,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { code: "issue_price_below_par", field: "issuePricePerShare" },
        ],
      },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateApicIssuance({
        issuePricePerShare: -20,
        parValuePerShare: 5,
        sharesIssued: 100,
      }),
    ).toThrow();
    expect(() =>
      calculateApicIssuance({
        issuePricePerShare: 20,
        parValuePerShare: NaN,
        sharesIssued: 100,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(
      runApicIssuance({ issuePricePerShare: 20, parValuePerShare: 5 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "sharesIssued" }] },
    });
  });
});
