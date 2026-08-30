import { describe, expect, it } from "vitest";
import {
  fixedAssetSightExample,
  runFixedAssetSight,
  verifyFixedAssetSightObservations,
} from "./tool.js";

describe("fixed asset sight verification", () => {
  it("reproduces its canonical example", () => {
    expect(runFixedAssetSight(fixedAssetSightExample.input)).toEqual({
      ok: true,
      output: fixedAssetSightExample.output,
    });
  });

  it("accepts complete observations", () => {
    expect(
      verifyFixedAssetSightObservations({
        selectedAssetIds: ["A", "B"],
        observedAssetIds: ["A", "B"],
      }).complete,
    ).toBe(true);
  });

  it("normalizes surrounding spaces when matching", () => {
    expect(
      verifyFixedAssetSightObservations({
        selectedAssetIds: ["A"],
        observedAssetIds: [" A "],
      }).unobservedAssetIds,
    ).toEqual([]);
  });

  it("rejects an observed asset outside the selection", () => {
    expect(
      runFixedAssetSight({
        selectedAssetIds: ["A"],
        observedAssetIds: ["B"],
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "unselected_observed_asset", field: "observedAssetIds.0" },
        ],
      },
      ok: false,
    });
  });
});
