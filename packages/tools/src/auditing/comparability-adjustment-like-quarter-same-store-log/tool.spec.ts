import { describe, expect, it } from "vitest";
import {
  comparabilityAdjustmentExample,
  runComparabilityAdjustment,
  summarizeComparabilityAdjustments,
} from "./tool.js";

describe("comparability adjustment log", () => {
  it("reproduces its canonical example", () => {
    expect(
      runComparabilityAdjustment(comparabilityAdjustmentExample.input),
    ).toEqual({
      ok: true,
      output: comparabilityAdjustmentExample.output,
    });
  });

  it("nets positive and negative adjustments", () => {
    expect(
      summarizeComparabilityAdjustments({
        adjustments: [
          [0, 100, 1],
          [1, -30, 1],
        ],
      }).netAdjustment,
    ).toBe(70);
  });

  it("treats an empty adjustment log as complete", () => {
    expect(
      summarizeComparabilityAdjustments({ adjustments: [] }),
    ).toMatchObject({ logComplete: true, netAdjustment: 0 });
  });

  it("rejects an unsupported evidence flag", () => {
    expect(
      runComparabilityAdjustment({ adjustments: [[0, 1, 2]] }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_adjustment_evidence", field: "adjustments.0.2" },
        ],
      },
      ok: false,
    });
  });
});
