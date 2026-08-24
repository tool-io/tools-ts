import { describe, expect, it } from "vitest";
import {
  calculateStatusInconsistency,
  statusInconsistencyScoreExample,
  statusInconsistencyScoreTool,
  runStatusInconsistencyScore,
} from "./tool.js";

describe("statusInconsistencyScoreTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runStatusInconsistencyScore(statusInconsistencyScoreExample.input),
    ).toEqual({
      ok: true,
      output: statusInconsistencyScoreExample.output,
    });
  });

  it("uses the range of the three percentile ranks", () => {
    expect(
      calculateStatusInconsistency({
        educationRankPercent: 20,
        incomeRankPercent: 50,
        prestigeRankPercent: 30,
      }),
    ).toEqual({ inconsistencyRange: 30 });
    const result = runStatusInconsistencyScore({
      educationRankPercent: 101,
      incomeRankPercent: 50,
      prestigeRankPercent: 30,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("educationRankPercent");
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(statusInconsistencyScoreExample))).toEqual(
      statusInconsistencyScoreExample,
    );
    expect(statusInconsistencyScoreTool.contractVersion).toBe(1);
    expect(statusInconsistencyScoreTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runStatusInconsistencyScore(null).ok).toBe(false);
    expect(
      runStatusInconsistencyScore({
        ...statusInconsistencyScoreExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
