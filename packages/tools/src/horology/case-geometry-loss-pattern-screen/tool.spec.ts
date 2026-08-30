import { describe, expect, it } from "vitest";
import {
  caseGeometryLossExample,
  runCaseGeometryLoss,
  screenCaseGeometryLoss,
} from "./tool.js";

describe("case geometry-loss pattern screen", () => {
  it("reproduces the canonical 5-percent geometry example", () => {
    expect(runCaseGeometryLoss(caseGeometryLossExample.input)).toEqual({
      ok: true,
      output: caseGeometryLossExample.output,
    });
  });

  it("accepts a value exactly at the caller limit", () => {
    expect(
      screenCaseGeometryLoss({
        referenceOriginalThicknessMillimeters: 10,
        currentMeasuredThicknessMillimeters: 9.5,
        maximumAllowedLossPercent: 5,
      }).withinCallerLossLimit,
    ).toBe(true);
  });

  it("rejects a measured thickness above the loss reference", () => {
    expect(
      runCaseGeometryLoss({
        referenceOriginalThicknessMillimeters: 10,
        currentMeasuredThicknessMillimeters: 10.1,
        maximumAllowedLossPercent: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "current_exceeds_reference",
            field: "currentMeasuredThicknessMillimeters",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects zero reference thickness", () => {
    expect(
      runCaseGeometryLoss({
        referenceOriginalThicknessMillimeters: 0,
        currentMeasuredThicknessMillimeters: 1,
        maximumAllowedLossPercent: 5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "reference_thickness_invalid",
            field: "referenceOriginalThicknessMillimeters",
          },
        ],
      },
      ok: false,
    });
  });

  it("rejects a negative caller limit", () => {
    expect(
      runCaseGeometryLoss({
        referenceOriginalThicknessMillimeters: 10,
        currentMeasuredThicknessMillimeters: 9.5,
        maximumAllowedLossPercent: -1,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "maximumAllowedLossPercent" }],
      },
      ok: false,
    });
  });
});
