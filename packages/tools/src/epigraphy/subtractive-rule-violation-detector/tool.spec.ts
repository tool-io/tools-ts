import { describe, expect, it } from "vitest";
import {
  calculateSubtractiveRuleViolationDetector,
  subtractiveRuleViolationDetectorExample,
  runSubtractiveRuleViolationDetector,
} from "./tool.js";

describe("epigraphy/subtractive-rule-violation-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSubtractiveRuleViolationDetector(
        subtractiveRuleViolationDetectorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: subtractiveRuleViolationDetectorExample.output,
    });
  });

  it("flags stacked subtractors and illegal pairs", () => {
    const stacked = calculateSubtractiveRuleViolationDetector({
      numeral: "IIX",
    });
    expect(stacked.violations).toEqual([
      "Stacked subtractors before X at position 1.",
    ]);
    expect(stacked.isValid).toBe(false);
    expect(
      calculateSubtractiveRuleViolationDetector({ numeral: "VX" }).violations,
    ).toEqual(["Invalid subtractive pair VX."]);
    expect(
      calculateSubtractiveRuleViolationDetector({ numeral: "IXC" }).isValid,
    ).toBe(false);
  });

  it("enforces the selected repetition ceiling", () => {
    expect(
      calculateSubtractiveRuleViolationDetector({ numeral: "IIII" })
        .violationCount,
    ).toBe(1);
    expect(
      calculateSubtractiveRuleViolationDetector({
        numeral: "IIII",
        repetitionPolicy: "allowFour",
      }).violationCount,
    ).toBe(0);
    expect(
      calculateSubtractiveRuleViolationDetector({ numeral: "VV" }).violations,
    ).toEqual(["Symbol V repeats 2 times."]);
  });

  it("rejects empty or non-numeral input", () => {
    expect(runSubtractiveRuleViolationDetector({ numeral: "" }).ok).toBe(false);
    expect(runSubtractiveRuleViolationDetector({ numeral: "XYZ" }).ok).toBe(
      false,
    );
  });
});
