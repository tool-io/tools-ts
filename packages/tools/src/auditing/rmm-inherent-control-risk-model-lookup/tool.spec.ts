import { describe, expect, it } from "vitest";
import {
  lookupRmmInherentRisk,
  rmmRiskMatrixExample,
  runRmmRiskMatrix,
} from "./tool.js";

const matrix = [
  [5, 10, 20, 30, 40],
  [10, 20, 30, 40, 50],
  [20, 30, 40, 60, 70],
  [30, 40, 60, 80, 90],
  [40, 50, 70, 90, 100],
];

describe("RMM inherent control risk lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runRmmRiskMatrix(rmmRiskMatrixExample.input)).toEqual({
      ok: true,
      output: rmmRiskMatrixExample.output,
    });
  });

  it("selects the requested likelihood-impact cell", () => {
    expect(
      lookupRmmInherentRisk({
        impact: 3,
        likelihood: 2,
        lowUpperPercent: 20,
        moderateUpperPercent: 50,
        riskMatrix: matrix,
      }).riskScorePercent,
    ).toBe(30);
  });

  it("classifies a noncritical score above the moderate threshold as high", () => {
    expect(
      lookupRmmInherentRisk({
        impact: 4,
        likelihood: 4,
        lowUpperPercent: 20,
        moderateUpperPercent: 50,
        riskMatrix: matrix,
      }).classification,
    ).toBe("high");
  });

  it("rejects a matrix with the wrong shape", () => {
    expect(
      runRmmRiskMatrix({
        impact: 1,
        likelihood: 1,
        lowUpperPercent: 20,
        moderateUpperPercent: 50,
        riskMatrix: [[1]],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_risk_matrix", field: "riskMatrix" }] },
      ok: false,
    });
  });
});
