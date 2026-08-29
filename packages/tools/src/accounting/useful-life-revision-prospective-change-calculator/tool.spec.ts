import { describe, expect, it } from "vitest";
import {
  calculateUsefulLifeRevision,
  runUsefulLifeRevision,
  usefulLifeRevisionExample,
} from "./tool.js";

describe("useful life revision prospective change", () => {
  it("executes its canonical example exactly", () => {
    expect(runUsefulLifeRevision(usefulLifeRevisionExample.input)).toEqual({
      ok: true,
      output: usefulLifeRevisionExample.output,
    });
  });

  it("matches the OpenStax Urquhart building case", () => {
    // 500k building, 45k salvage, 40y life; after 10 years (accumulated 113,750),
    // total life revised to 50y: 40 remaining, book 386,250, revised annual 8,531.25.
    expect(
      calculateUsefulLifeRevision({
        accumulatedDepreciation: 113750,
        cost: 500000,
        newRemainingYears: 40,
        newSalvageValue: 45000,
      }),
    ).toEqual({
      bookValueAtRevision: 386250,
      revisedAnnualDepreciation: 8531.25,
    });
  });

  it("matches the Montezuma truck revision from OpenStax PB13", () => {
    // Truck 20k, salvage 8k, 10y straight line. After 5y book value is 14k... but the
    // textbook revision moves salvage to 10k with 5 years left: (14,000 - 10,000) / 5 = 800.
    expect(
      calculateUsefulLifeRevision({
        accumulatedDepreciation: 6000,
        cost: 20000,
        newRemainingYears: 5,
        newSalvageValue: 10000,
      }),
    ).toEqual({ bookValueAtRevision: 14000, revisedAnnualDepreciation: 800 });
  });

  it("handles a revision that consumes the full remaining book value", () => {
    expect(
      calculateUsefulLifeRevision({
        accumulatedDepreciation: 14000,
        cost: 20000,
        newRemainingYears: 5,
        newSalvageValue: 6000,
      }),
    ).toEqual({ bookValueAtRevision: 6000, revisedAnnualDepreciation: 0 });
  });

  it("rejects accumulated depreciation exceeding cost", () => {
    expect(() =>
      calculateUsefulLifeRevision({
        accumulatedDepreciation: 21000,
        cost: 20000,
        newRemainingYears: 5,
        newSalvageValue: 0,
      }),
    ).toThrow();
  });

  it("rejects salvage exceeding book value with a stable code", () => {
    expect(
      runUsefulLifeRevision({
        accumulatedDepreciation: 10000,
        cost: 20000,
        newRemainingYears: 5,
        newSalvageValue: 15000,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { code: "salvage_exceeds_book_value", field: "newSalvageValue" },
        ],
      },
    });
  });

  it("rejects malformed runtime input", () => {
    expect(
      runUsefulLifeRevision({
        accumulatedDepreciation: 10000,
        cost: 20000,
        newSalvageValue: 1000,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "newRemainingYears" }],
      },
    });
  });

  it("rejects invalid direct input", () => {
    expect(() =>
      calculateUsefulLifeRevision({
        accumulatedDepreciation: 10000,
        cost: 0,
        newRemainingYears: 5,
        newSalvageValue: 0,
      }),
    ).toThrow();
    expect(() =>
      calculateUsefulLifeRevision({
        accumulatedDepreciation: 10000,
        cost: 20000,
        newRemainingYears: 0,
        newSalvageValue: 0,
      }),
    ).toThrow();
  });
});
