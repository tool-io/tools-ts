import { describe, expect, it } from "vitest";
import {
  calculateDepletionUnits,
  depletionUnitsExample,
  runDepletionUnits,
} from "./tool.js";

describe("depletion of natural resources", () => {
  it("executes its canonical example exactly", () => {
    expect(runDepletionUnits(depletionUnitsExample.input)).toEqual({
      ok: true,
      output: depletionUnitsExample.output,
    });
  });

  it("matches the OpenStax oil well known value", () => {
    expect(
      calculateDepletionUnits({
        extractedUnits: 4000,
        resourceCost: 1000000,
        salvageValue: 0,
        totalUnitsEstimate: 10000,
      }),
    ).toEqual({ depletionRate: 100, depletionExpense: 400000 });
  });

  it("matches the Underwood diamond mine year-one value", () => {
    // 46,000,000 rights, 2,000,000 tons estimate, 50,000 tons year one.
    expect(
      calculateDepletionUnits({
        extractedUnits: 50000,
        resourceCost: 46000000,
        salvageValue: 0,
        totalUnitsEstimate: 2000000,
      }),
    ).toEqual({ depletionRate: 23, depletionExpense: 1150000 });
  });

  it("respects a nonzero salvage value", () => {
    // Land worth 500,000 under a 5,000,000 timber purchase, 2,500 acres.
    expect(
      calculateDepletionUnits({
        extractedUnits: 150,
        resourceCost: 5000000,
        salvageValue: 500000,
        totalUnitsEstimate: 2500,
      }),
    ).toEqual({ depletionRate: 1800, depletionExpense: 270000 });
  });

  it("rejects an unrepresentable depletion expense", () => {
    expect(
      runDepletionUnits({
        extractedUnits: Number.MAX_VALUE,
        resourceCost: Number.MAX_VALUE,
        salvageValue: 0,
        totalUnitsEstimate: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "result_not_finite", field: "extractedUnits" }],
      },
    });
  });

  it("expenses nothing when no units are extracted", () => {
    expect(
      calculateDepletionUnits({
        extractedUnits: 0,
        resourceCost: 1000000,
        salvageValue: 0,
        totalUnitsEstimate: 10000,
      }),
    ).toEqual({ depletionRate: 100, depletionExpense: 0 });
  });

  it("scales linearly in extracted units", () => {
    const base = calculateDepletionUnits({
      extractedUnits: 1000,
      resourceCost: 1000000,
      salvageValue: 100000,
      totalUnitsEstimate: 9000,
    });
    const doubled = calculateDepletionUnits({
      extractedUnits: 2000,
      resourceCost: 1000000,
      salvageValue: 100000,
      totalUnitsEstimate: 9000,
    });
    expect(doubled.depletionExpense).toBeCloseTo(base.depletionExpense * 2, 9);
  });

  it("rejects salvage exceeding cost with a stable code", () => {
    expect(
      runDepletionUnits({
        extractedUnits: 100,
        resourceCost: 1000,
        salvageValue: 5000,
        totalUnitsEstimate: 10000,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "salvage_exceeds_cost", field: "salvageValue" }],
      },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateDepletionUnits({
        extractedUnits: 4000,
        resourceCost: 1000000,
        salvageValue: 0,
        totalUnitsEstimate: 0,
      }),
    ).toThrow();
    expect(() =>
      calculateDepletionUnits({
        extractedUnits: -5,
        resourceCost: 1000000,
        salvageValue: 0,
        totalUnitsEstimate: 10000,
      }),
    ).toThrow();
  });

  it("rejects malformed runtime input", () => {
    expect(
      runDepletionUnits({
        extractedUnits: 4000,
        resourceCost: 1000000,
        totalUnitsEstimate: 10000,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "salvageValue" }] },
    });
  });
});
