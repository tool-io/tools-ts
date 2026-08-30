import { describe, expect, it } from "vitest";
import {
  runVermeilThickness,
  screenVermeilLayerThickness,
  vermeilThicknessExample,
} from "./tool.js";

describe("vermeil layer-thickness screen", () => {
  it("reproduces the canonical 2.5-versus-5-micron example", () => {
    expect(runVermeilThickness(vermeilThicknessExample.input)).toEqual({
      ok: true,
      output: vermeilThicknessExample.output,
    });
  });

  it("accepts a layer exactly at the caller minimum", () => {
    expect(
      screenVermeilLayerThickness({
        jurisdictionRequiredMinimumMicrometers: 5,
        measuredGoldLayerMicrometers: 5,
      }).meetsCallerRequirement,
    ).toBe(true);
  });

  it("reports excess above the caller minimum", () => {
    expect(
      screenVermeilLayerThickness({
        jurisdictionRequiredMinimumMicrometers: 5,
        measuredGoldLayerMicrometers: 8,
      }).additionalThicknessMicrometers,
    ).toBe(3);
  });

  it("does not report a negative shortfall as excess", () => {
    expect(
      screenVermeilLayerThickness({
        jurisdictionRequiredMinimumMicrometers: 5,
        measuredGoldLayerMicrometers: 2.5,
      }).additionalThicknessMicrometers,
    ).toBe(0);
  });

  it("rejects zero measured thickness", () => {
    expect(
      runVermeilThickness({
        jurisdictionRequiredMinimumMicrometers: 5,
        measuredGoldLayerMicrometers: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "gold_thickness_invalid",
            field: "measuredGoldLayerMicrometers",
          },
        ],
      },
      ok: false,
    });
  });
});
