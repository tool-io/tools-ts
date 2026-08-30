import { describe, expect, it } from "vitest";
import {
  mapMindUploadingFeasibility,
  mindUploadingFeasibilityExample,
  runMindUploadingFeasibility,
} from "./tool.js";

describe("mind uploading feasibility map", () => {
  it("reproduces its canonical example", () => {
    expect(
      runMindUploadingFeasibility(mindUploadingFeasibilityExample.input),
    ).toEqual({
      ok: true,
      output: mindUploadingFeasibilityExample.output,
    });
  });

  it("reports an emerging readiness band", () => {
    expect(
      mapMindUploadingFeasibility({
        brainModelAccuracyPercent: 80,
        identityContinuityPercent: 80,
        memoryCoveragePercent: 80,
        reversibilityPercent: 80,
        readinessThresholdPercent: 70,
      }),
    ).toMatchObject({
      blockerCount: 0,
      readinessBand: "emerging",
      thresholdMet: true,
    });
  });

  it("reports a low readiness band", () => {
    expect(
      mapMindUploadingFeasibility({
        brainModelAccuracyPercent: 0,
        identityContinuityPercent: 0,
        memoryCoveragePercent: 0,
        reversibilityPercent: 0,
        readinessThresholdPercent: 50,
      }).readinessBand,
    ).toBe("low");
  });

  it("rejects a feasibility value above 100", () => {
    expect(
      runMindUploadingFeasibility({
        brainModelAccuracyPercent: 101,
        identityContinuityPercent: 0,
        memoryCoveragePercent: 0,
        reversibilityPercent: 0,
        readinessThresholdPercent: 50,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "invalid_field",
            field: "brainModelAccuracyPercent",
          },
        ],
      },
      ok: false,
    });
  });
});
