import { describe, expect, it } from "vitest";
import {
  runStrainBalancedCriticalThickness,
  strainBalancedCriticalThicknessExample,
} from "./tool.js";

describe("strain-balanced critical thickness", () => {
  it("reproduces the documented inverse scaling", () =>
    expect(
      runStrainBalancedCriticalThickness(
        strainBalancedCriticalThicknessExample.input,
      ),
    ).toEqual({
      ok: true,
      output: strainBalancedCriticalThicknessExample.output,
    }));
  it("equals the bulk value with no strain compensation", () =>
    expect(
      runStrainBalancedCriticalThickness({
        bulkCriticalThicknessNm: 50,
        residualStrainFraction: 1,
      }),
    ).toEqual({ ok: true, output: { effectiveCriticalThicknessNm: 50 } }));
  it("rejects perfect balance because this heuristic would diverge", () =>
    expect(
      runStrainBalancedCriticalThickness({
        bulkCriticalThicknessNm: 50,
        residualStrainFraction: 0,
      }),
    ).toMatchObject({ ok: false }));
});
