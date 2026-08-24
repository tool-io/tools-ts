import { describe, expect, it } from "vitest";
import {
  calculateReplacementLevelFertility,
  replacementLevelFertilityCheckerExample,
  replacementLevelFertilityCheckerTool,
  runReplacementLevelFertilityChecker,
} from "./tool.js";

describe("replacementLevelFertilityCheckerTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runReplacementLevelFertilityChecker(
        replacementLevelFertilityCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: replacementLevelFertilityCheckerExample.output,
    });
  });

  it("uses 2.1 as an inclusive conventional benchmark", () => {
    expect(
      calculateReplacementLevelFertility({ totalFertilityRate: 2.1 }),
    ).toEqual({
      gapToReplacement: 0,
      replacementLevel: true,
    });
    const result = runReplacementLevelFertilityChecker({
      totalFertilityRate: -0.1,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected failure");
    expect(result.error.issues[0].field).toBe("totalFertilityRate");
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(replacementLevelFertilityCheckerExample)),
    ).toEqual(replacementLevelFertilityCheckerExample);
    expect(replacementLevelFertilityCheckerTool.contractVersion).toBe(1);
    expect(replacementLevelFertilityCheckerTool.execution).toEqual({
      kind: "pure",
    });
  });

  it("returns structured errors for malformed input", () => {
    expect(runReplacementLevelFertilityChecker(null).ok).toBe(false);
    expect(
      runReplacementLevelFertilityChecker({
        ...replacementLevelFertilityCheckerExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
