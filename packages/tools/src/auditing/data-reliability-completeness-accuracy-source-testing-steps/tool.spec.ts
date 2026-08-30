import { describe, expect, it } from "vitest";
import {
  assessDataReliability,
  dataReliabilityExample,
  runDataReliability,
} from "./tool.js";

describe("data reliability testing steps", () => {
  it("reproduces its canonical example", () => {
    expect(runDataReliability(dataReliabilityExample.input)).toEqual({
      ok: true,
      output: dataReliabilityExample.output,
    });
  });

  it("accepts a reconciliation difference exactly at tolerance", () => {
    expect(
      assessDataReliability({
        accuracyTested: true,
        completenessTested: true,
        reconciliationDifference: -50,
        sourceIndependent: true,
        tolerance: 50,
      }).assessment,
    ).toBe("reliable");
  });

  it("classifies two met criteria as conditional", () => {
    expect(
      assessDataReliability({
        accuracyTested: true,
        completenessTested: false,
        reconciliationDifference: 100,
        sourceIndependent: true,
        tolerance: 50,
      }).assessment,
    ).toBe("conditional");
  });

  it("rejects a negative tolerance", () => {
    expect(
      runDataReliability({
        accuracyTested: true,
        completenessTested: true,
        reconciliationDifference: 0,
        sourceIndependent: true,
        tolerance: -1,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "tolerance" }] },
      ok: false,
    });
  });
});
