import { describe, expect, it } from "vitest";
import { lineEdgeRoughnessExample, runLineEdgeRoughness } from "./tool.js";

describe("Line Edge Roughness Estimator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runLineEdgeRoughness(lineEdgeRoughnessExample.input)).toEqual({
      ok: true,
      output: lineEdgeRoughnessExample.output,
    });
  });

  it("uses the supplied calibrated sensitivity", () => {
    expect(
      runLineEdgeRoughness({
        doseVariationPercent: 2.5,
        sensitivityNmPerPercent: 0.5,
      }),
    ).toEqual({ ok: true, output: { lerThreeSigmaNm: 1.25 } });
  });

  it("allows zero variation or sensitivity", () => {
    expect(
      runLineEdgeRoughness({
        doseVariationPercent: 0,
        sensitivityNmPerPercent: 1,
      }),
    ).toEqual({ ok: true, output: { lerThreeSigmaNm: 0 } });
  });

  it("requires both nonnegative model inputs", () => {
    expect(runLineEdgeRoughness({}).ok).toBe(false);
    expect(
      runLineEdgeRoughness({
        doseVariationPercent: 5,
        sensitivityNmPerPercent: -1,
      }).ok,
    ).toBe(false);
  });
});
