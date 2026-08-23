import { describe, expect, it } from "vitest";
import {
  calculateChainLadderDevelopmentFactor,
  chainLadderDevelopmentFactorExample,
  runChainLadderDevelopmentFactor,
} from "./tool.js";

describe("Chain Ladder Development Factor Calculator", () => {
  it("reproduces its canonical example", () => {
    expect(
      runChainLadderDevelopmentFactor(
        chainLadderDevelopmentFactorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: chainLadderDevelopmentFactorExample.output,
    });
  });

  it("calculates the volume-weighted age-to-age factor", () => {
    expect(
      calculateChainLadderDevelopmentFactor({
        currentCumulativeLosses: [180, 330, 520],
        priorCumulativeLosses: [150, 300, 500],
      }),
    ).toEqual({ developmentFactor: 1030 / 950 });
  });

  it("returns one when the cumulative totals are unchanged", () => {
    expect(
      calculateChainLadderDevelopmentFactor({
        currentCumulativeLosses: [300, 700],
        priorCumulativeLosses: [300, 700],
      }),
    ).toEqual({ developmentFactor: 1 });
  });

  it("rejects mismatched lists, negative losses, and a zero denominator", () => {
    expect(
      runChainLadderDevelopmentFactor({
        currentCumulativeLosses: [100],
        priorCumulativeLosses: [100, 200],
      }),
    ).toMatchObject({
      error: { issues: [{ code: "length_mismatch" }] },
      ok: false,
    });
    expect(
      runChainLadderDevelopmentFactor({
        currentCumulativeLosses: [-1],
        priorCumulativeLosses: [100],
      }).ok,
    ).toBe(false);
    expect(
      runChainLadderDevelopmentFactor({
        currentCumulativeLosses: [50],
        priorCumulativeLosses: [0],
      }).ok,
    ).toBe(false);
  });
});
