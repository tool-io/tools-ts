import { describe, expect, it } from "vitest";
import {
  blockCoverageExample,
  checkBlockStratifiedCoverage,
  runBlockCoverage,
} from "./tool.js";

describe("block stratified selection coverage", () => {
  it("reproduces its canonical example", () => {
    expect(runBlockCoverage(blockCoverageExample.input)).toEqual({
      ok: true,
      output: blockCoverageExample.output,
    });
  });

  it("reports overcoverage as no deficit", () => {
    expect(
      checkBlockStratifiedCoverage({
        plannedAllocation: [0.5, 0.5],
        actualAllocation: [0.7, 0.3],
      }),
    ).toMatchObject({
      deficits: [0, 0.2],
      uncoveredBlockCount: 1,
      coveragePercent: 100,
    });
  });

  it("accepts complete block coverage", () => {
    expect(
      checkBlockStratifiedCoverage({
        plannedAllocation: [0.25, 0.75],
        actualAllocation: [0.25, 0.75],
      }).coveragePercent,
    ).toBe(100);
  });

  it("rejects allocation totals above one", () => {
    expect(
      runBlockCoverage({
        plannedAllocation: [0.7, 0.7],
        actualAllocation: [0.5, 0.5],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "allocation_total_exceeds_one", field: "" }] },
      ok: false,
    });
  });
});
