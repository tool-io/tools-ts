import { describe, expect, it } from "vitest";
import {
  runServiceQuoteRatio,
  screenServiceQuoteToReferenceValue,
  serviceQuoteRatioExample,
} from "./tool.js";

describe("service quote-to-reference-value screen", () => {
  it("reproduces the canonical 24-percent example", () => {
    expect(runServiceQuoteRatio(serviceQuoteRatioExample.input)).toEqual({
      ok: true,
      output: serviceQuoteRatioExample.output,
    });
  });

  it("accepts a quote exactly at the caller limit", () => {
    expect(
      screenServiceQuoteToReferenceValue({
        referenceValue: 1000,
        quotedServiceCost: 250,
        maximumAllowedPercentOfReferenceValue: 25,
      }).withinCallerPercentage,
    ).toBe(true);
  });

  it("rejects a quote above the caller limit", () => {
    expect(
      screenServiceQuoteToReferenceValue({
        referenceValue: 1000,
        quotedServiceCost: 251,
        maximumAllowedPercentOfReferenceValue: 25,
      }).withinCallerPercentage,
    ).toBe(false);
  });

  it("allows a zero quote", () => {
    expect(
      screenServiceQuoteToReferenceValue({
        referenceValue: 1000,
        quotedServiceCost: 0,
        maximumAllowedPercentOfReferenceValue: 0,
      }).costPercentOfReferenceValue,
    ).toBe(0);
  });

  it("rejects a zero reference value", () => {
    expect(
      runServiceQuoteRatio({
        referenceValue: 0,
        quotedServiceCost: 100,
        maximumAllowedPercentOfReferenceValue: 25,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "reference_value_invalid", field: "referenceValue" }],
      },
      ok: false,
    });
  });
});
