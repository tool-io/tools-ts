import { describe, expect, it } from "vitest";
import {
  compareInventoryObservationCounts,
  inventoryObservationExample,
  runInventoryObservation,
} from "./tool.js";

describe("inventory observation two-team controls", () => {
  it("reproduces its canonical example", () => {
    expect(runInventoryObservation(inventoryObservationExample.input)).toEqual({
      ok: true,
      output: inventoryObservationExample.output,
    });
  });

  it("accepts a difference exactly at tolerance", () => {
    expect(
      compareInventoryObservationCounts({
        controlTags: [1],
        firstCounts: [10],
        secondCounts: [11],
        tolerance: 1,
      }).reconciled,
    ).toBe(true);
  });

  it("flags an item without a control tag even when counts match", () => {
    expect(
      compareInventoryObservationCounts({
        controlTags: [0],
        firstCounts: [10],
        secondCounts: [10],
        tolerance: 0,
      }).discrepancyCount,
    ).toBe(1);
  });

  it("rejects mismatched observation arrays", () => {
    expect(
      runInventoryObservation({
        controlTags: [1],
        firstCounts: [10],
        secondCounts: [],
        tolerance: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "inventory_data_length_mismatch", field: "secondCounts" },
        ],
      },
      ok: false,
    });
  });
});
