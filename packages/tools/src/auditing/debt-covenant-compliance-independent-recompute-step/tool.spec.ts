import { describe, expect, it } from "vitest";
import {
  debtCovenantRecomputeExample,
  recomputeDebtCovenantCompliance,
  runDebtCovenantRecompute,
} from "./tool.js";

describe("debt covenant independent recomputation", () => {
  it("reproduces its canonical example", () => {
    expect(
      runDebtCovenantRecompute(debtCovenantRecomputeExample.input),
    ).toEqual({
      ok: true,
      output: debtCovenantRecomputeExample.output,
    });
  });

  it("flags a recomputed ratio above the covenant", () => {
    expect(
      recomputeDebtCovenantCompliance({
        covenantLimit: 3.5,
        reportedDenominator: 100,
        reportedNumerator: 300,
        sourceDenominator: 100,
        sourceNumerator: 360,
        tolerance: 0,
      }).compliant,
    ).toBe(false);
  });

  it("uses tolerance at the compliance boundary", () => {
    expect(
      recomputeDebtCovenantCompliance({
        covenantLimit: 3.5,
        reportedDenominator: 100,
        reportedNumerator: 351,
        sourceDenominator: 100,
        sourceNumerator: 351,
        tolerance: 0.01,
      }).compliant,
    ).toBe(true);
  });

  it("rejects a zero source denominator", () => {
    expect(
      runDebtCovenantRecompute({
        covenantLimit: 3.5,
        reportedDenominator: 100,
        reportedNumerator: 300,
        sourceDenominator: 0,
        sourceNumerator: 300,
        tolerance: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "zero_covenant_denominator", field: "" }] },
      ok: false,
    });
  });
});
