import { describe, expect, it } from "vitest";
import {
  analyzeCrossImpactPairs,
  crossImpactExample,
  runCrossImpact,
} from "./tool.js";

describe("cross-impact event pair matrix", () => {
  it("reproduces its canonical example", () => {
    expect(runCrossImpact(crossImpactExample.input)).toEqual({
      ok: true,
      output: crossImpactExample.output,
    });
  });

  it("finds a different strongest directed edge", () => {
    expect(
      analyzeCrossImpactPairs({
        eventIds: ["A", "B"],
        impactScores: [
          [0, 0.2],
          [0.7, 0],
        ],
      }).strongestPair,
    ).toBe("B -> A");
  });

  it("returns an empty strongest pair for an all-zero matrix", () => {
    expect(
      analyzeCrossImpactPairs({
        eventIds: ["A", "B"],
        impactScores: [
          [0, 0],
          [0, 0],
        ],
      }),
    ).toEqual({ reciprocalPairCount: 0, strongestPair: "", strongestScore: 0 });
  });

  it("rejects a nonzero diagonal score", () => {
    expect(
      runCrossImpact({
        eventIds: ["A", "B"],
        impactScores: [
          [0.2, 0],
          [0, 0],
        ],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_diagonal_score", field: "impactScores.0.0" }],
      },
      ok: false,
    });
  });
});
