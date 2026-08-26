import { describe, expect, it } from "vitest";
import {
  calculateFirstTransitionPhaseLookup,
  runFirstTransitionPhaseLookup,
  firstTransitionPhaseLookupExample,
} from "./tool.js";

describe("demography/first-transition-phase-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runFirstTransitionPhaseLookup(firstTransitionPhaseLookupExample.input),
    ).toEqual({
      ok: true,
      output: firstTransitionPhaseLookupExample.output,
    });
  });

  it("returns the pre-industrial table row for stage one", () => {
    const row = calculateFirstTransitionPhaseLookup({ phase: "stage-1" });
    expect(row.growthPattern).toContain("near-zero");
    expect(row.typicalCdrBand).toContain("high");
  });

  it("rejects phases outside the table", () => {
    expect(runFirstTransitionPhaseLookup({ phase: "stage-5" }).ok).toBe(false);
    expect(runFirstTransitionPhaseLookup({ phase: "wobble" }).ok).toBe(false);
  });
});
