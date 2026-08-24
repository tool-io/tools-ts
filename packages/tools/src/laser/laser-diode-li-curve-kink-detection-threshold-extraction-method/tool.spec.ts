import { describe, expect, it } from "vitest";
import {
  liCurveAnalysisExample as example,
  runLiCurveAnalysis,
} from "./tool.js";
describe("laser diode L-I analysis", () => {
  it("extracts the linear threshold and slope", () =>
    expect(runLiCurveAnalysis(example.input)).toEqual({
      ok: true,
      output: example.output,
    }));
  it("rejects unsorted currents and mismatched samples", () => {
    expect(
      runLiCurveAnalysis({
        currentsMa: [1, 1, 2],
        powersMw: [0, 1, 2],
        tolerancePercent: 30,
      }).ok,
    ).toBe(false);
    expect(
      runLiCurveAnalysis({
        currentsMa: [1, 2, 3],
        powersMw: [0, 1],
        tolerancePercent: 30,
      }).ok,
    ).toBe(false);
  });
});
