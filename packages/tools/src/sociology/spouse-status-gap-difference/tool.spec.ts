import { describe, expect, it } from "vitest";
import {
  calculateSpouseStatusGap,
  spouseStatusGapDifferenceExample,
  spouseStatusGapDifferenceTool,
  runSpouseStatusGapDifference,
} from "./tool.js";

describe("spouseStatusGapDifferenceTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runSpouseStatusGapDifference(spouseStatusGapDifferenceExample.input),
    ).toEqual({
      ok: true,
      output: spouseStatusGapDifferenceExample.output,
    });
  });

  it("is symmetric and zero for equal prestige scores", () => {
    expect(
      calculateSpouseStatusGap({
        respondentPrestigeScore: 40,
        spousePrestigeScore: 70,
      }),
    ).toEqual({ statusGap: 30 });
    expect(
      calculateSpouseStatusGap({
        respondentPrestigeScore: 70,
        spousePrestigeScore: 40,
      }),
    ).toEqual({ statusGap: 30 });
    const result = runSpouseStatusGapDifference({
      respondentPrestigeScore: -1,
      spousePrestigeScore: 40,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("respondentPrestigeScore");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(spouseStatusGapDifferenceExample)),
    ).toEqual(spouseStatusGapDifferenceExample);
    expect(spouseStatusGapDifferenceTool.contractVersion).toBe(1);
    expect(spouseStatusGapDifferenceTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSpouseStatusGapDifference(null).ok).toBe(false);
    expect(
      runSpouseStatusGapDifference({
        ...spouseStatusGapDifferenceExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
