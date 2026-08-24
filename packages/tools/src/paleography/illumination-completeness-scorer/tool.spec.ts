import { describe, expect, it } from "vitest";
import {
  illuminationCompletenessScorerExample,
  runIlluminationCompletenessScorer,
} from "./tool.js";

describe("illumination-completeness-scorer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runIlluminationCompletenessScorer(
        illuminationCompletenessScorerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: illuminationCompletenessScorerExample.output,
    });
  });

  it("treats an unplanned category as complete", () => {
    const result = runIlluminationCompletenessScorer({
      plannedInitials: 4,
      executedInitials: 4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.miniaturesPercent).toBe(100);
    expect(result.output.statusBand).toBe("complete");
  });

  it("rejects executed counts above planned", () => {
    expect(
      runIlluminationCompletenessScorer({
        plannedInitials: 2,
        executedInitials: 3,
      }).ok,
    ).toBe(false);
  });
});
