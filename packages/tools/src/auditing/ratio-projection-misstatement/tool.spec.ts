import { describe, expect, it } from "vitest";
import {
  projectRatioMisstatement,
  ratioProjectionExample,
  runRatioProjection,
} from "./tool.js";

describe("ratio projection misstatement", () => {
  it("reproduces its canonical example", () => {
    expect(runRatioProjection(ratioProjectionExample.input)).toEqual({
      ok: true,
      output: ratioProjectionExample.output,
    });
  });

  it("projects no misstatement for an exact sample", () => {
    expect(
      projectRatioMisstatement({
        auditedSampleValue: 100_000,
        populationValue: 1_000_000,
        recordedSampleValue: 100_000,
        tolerance: 0,
      }),
    ).toMatchObject({
      auditedDifference: 0,
      projectedMisstatement: 0,
      exceedsTolerance: false,
    });
  });

  it("projects a half-cell overstatement proportionally", () => {
    expect(
      projectRatioMisstatement({
        auditedSampleValue: 50_000,
        populationValue: 1_000_000,
        recordedSampleValue: 100_000,
        tolerance: 0,
      }).projectedMisstatement,
    ).toBe(500_000);
  });

  it("projects an understatement as a negative amount", () => {
    expect(
      projectRatioMisstatement({
        auditedSampleValue: 110,
        populationValue: 1_000,
        recordedSampleValue: 100,
        tolerance: 10,
      }).projectedMisstatement,
    ).toBe(-100);
  });
});
