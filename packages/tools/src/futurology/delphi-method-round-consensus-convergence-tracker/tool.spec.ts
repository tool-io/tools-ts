import { describe, expect, it } from "vitest";
import {
  delphiConvergenceExample,
  runDelphiConvergence,
  trackDelphiConsensusConvergence,
} from "./tool.js";

describe("Delphi consensus convergence tracker", () => {
  it("reproduces its canonical example", () => {
    expect(runDelphiConvergence(delphiConvergenceExample.input)).toEqual({
      ok: true,
      output: delphiConvergenceExample.output,
    });
  });

  it("accepts a spread exactly at the threshold", () => {
    expect(
      trackDelphiConsensusConvergence({
        convergenceThreshold: 5,
        roundMedians: [60],
        roundSpreads: [5],
      }).converged,
    ).toBe(true);
  });

  it("reports nonconvergence after the supplied rounds", () => {
    expect(
      trackDelphiConsensusConvergence({
        convergenceThreshold: 5,
        roundMedians: [50, 55],
        roundSpreads: [12, 6],
      }),
    ).toMatchObject({ converged: false, finalMedian: 55, finalSpread: 6 });
  });

  it("rejects mismatched round arrays", () => {
    expect(
      runDelphiConvergence({
        convergenceThreshold: 5,
        roundMedians: [1],
        roundSpreads: [],
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "round_data_length_mismatch", field: "roundSpreads" }],
      },
      ok: false,
    });
  });
});
