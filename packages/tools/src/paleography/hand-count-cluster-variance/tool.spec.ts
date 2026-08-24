import { describe, expect, it } from "vitest";
import {
  handCountClusterVarianceExample,
  runHandCountClusterVariance,
} from "./tool.js";

describe("hand-count-cluster-variance", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHandCountClusterVariance(handCountClusterVarianceExample.input),
    ).toEqual({
      ok: true,
      output: handCountClusterVarianceExample.output,
    });
  });

  it("confirms well-separated clusters as distinct hands", () => {
    const result = runHandCountClusterVariance({
      clusterMeans: [9, 12],
      pooledWithinStd: 0.5,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.plausiblyDistinctHands).toBe(true);
    expect(result.output.minGapOverStd).toBeCloseTo(6, 10);
  });

  it("requires at least two cluster means", () => {
    expect(
      runHandCountClusterVariance({ clusterMeans: [9], pooledWithinStd: 0.5 })
        .ok,
    ).toBe(false);
  });

  it("keeps a finite mean when a naive sum would overflow", () => {
    const result = runHandCountClusterVariance({
      clusterMeans: [1e308, 1e308],
      pooledWithinStd: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.betweenClusterVariance).toBe(0);
    expect(result.output.cvPercent).toBe(0);
  });

  it("keeps a finite variance when squared deviations would overflow", () => {
    const result = runHandCountClusterVariance({
      clusterMeans: [1e154, 3e154],
      pooledWithinStd: 1e154,
    });
    if (!result.ok) throw new Error("expected success");
    expect(Number.isFinite(result.output.betweenClusterVariance)).toBe(true);
    expect(
      (result.output.betweenClusterVariance as number) / 1e308,
    ).toBeCloseTo(1, 12);
    expect(result.output.cvPercent).toBeCloseTo(50, 12);
  });
});
