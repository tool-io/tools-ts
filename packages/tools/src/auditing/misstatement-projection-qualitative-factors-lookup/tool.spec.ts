import { describe, expect, it } from "vitest";
import {
  applyQualitativeProjectionFactors,
  qualitativeProjectionExample,
  runQualitativeProjection,
} from "./tool.js";

describe("qualitative misstatement projection factors", () => {
  it("reproduces its canonical example", () => {
    expect(
      runQualitativeProjection(qualitativeProjectionExample.input),
    ).toEqual({
      ok: true,
      output: qualitativeProjectionExample.output,
    });
  });

  it("leaves projection unchanged when no factors are present", () => {
    expect(
      applyQualitativeProjectionFactors({
        factorWeights: [0.2, 0.3],
        overallFactor: 1,
        presentFactorWeights: [0, 0],
        quantitativeProjection: 1000,
      }).adjustedProjection,
    ).toBe(1000);
  });

  it("returns zero when the overall factor is zero", () => {
    expect(
      applyQualitativeProjectionFactors({
        factorWeights: [0.2],
        overallFactor: 0,
        presentFactorWeights: [1],
        quantitativeProjection: 1000,
      }).adjustedProjection,
    ).toBe(0);
  });

  it("rejects mismatched factor arrays", () => {
    expect(
      runQualitativeProjection({
        factorWeights: [0.2],
        overallFactor: 1,
        presentFactorWeights: [],
        quantitativeProjection: 1000,
      }),
    ).toMatchObject({
      error: {
        issues: [
          {
            code: "factor_data_length_mismatch",
            field: "presentFactorWeights",
          },
        ],
      },
      ok: false,
    });
  });
});
