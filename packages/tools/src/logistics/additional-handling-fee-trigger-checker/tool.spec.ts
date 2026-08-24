import { describe, expect, it } from "vitest";
import {
  additionalHandlingFeeTriggerCheckerExample,
  calculateAdditionalHandlingFeeTriggerChecker,
  runAdditionalHandlingFeeTriggerChecker,
} from "./tool.js";

describe("additional-handling-fee-trigger-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAdditionalHandlingFeeTriggerChecker(
        additionalHandlingFeeTriggerCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: additionalHandlingFeeTriggerCheckerExample.output,
    });
  });

  it("uses the longest side as length when calculating length plus girth", () => {
    const expected = {
      longestSideTrigger: true,
      secondLongestSideTrigger: false,
      weightTrigger: false,
      lengthPlusGirthTrigger: false,
      additionalHandlingApplies: true,
    };

    expect(
      calculateAdditionalHandlingFeeTriggerChecker({
        lengthIn: 10,
        widthIn: 10,
        heightIn: 50,
        weightLb: 20,
      }),
    ).toEqual(expected);
    expect(
      calculateAdditionalHandlingFeeTriggerChecker({
        lengthIn: 50,
        widthIn: 10,
        heightIn: 10,
        weightLb: 20,
      }),
    ).toEqual(expected);
  });

  it("checks the second-longest side independently", () => {
    expect(
      calculateAdditionalHandlingFeeTriggerChecker({
        lengthIn: 40,
        widthIn: 31,
        heightIn: 10,
        weightLb: 20,
        maximumLengthPlusGirthIn: 200,
      }),
    ).toEqual({
      longestSideTrigger: false,
      secondLongestSideTrigger: true,
      weightTrigger: false,
      lengthPlusGirthTrigger: false,
      additionalHandlingApplies: true,
    });
  });

  it("does not fire triggers at their exact thresholds", () => {
    expect(
      calculateAdditionalHandlingFeeTriggerChecker({
        lengthIn: 48,
        widthIn: 30,
        heightIn: 8,
        weightLb: 50,
        maximumLengthPlusGirthIn: 124,
      }),
    ).toEqual({
      longestSideTrigger: false,
      secondLongestSideTrigger: false,
      weightTrigger: false,
      lengthPlusGirthTrigger: false,
      additionalHandlingApplies: false,
    });
  });

  it("reports the field and code for an invalid direct measurement", () => {
    expect(
      runAdditionalHandlingFeeTriggerChecker({
        lengthIn: 12,
        widthIn: 10,
        heightIn: 6,
        weightLb: 0,
      }),
    ).toEqual({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [
          {
            code: "invalid_field",
            field: "weightLb",
            message: "Weight is invalid.",
          },
        ],
      },
    });
  });

  it("rejects a non-finite threshold in the direct calculation", () => {
    expect(() =>
      calculateAdditionalHandlingFeeTriggerChecker({
        lengthIn: 12,
        widthIn: 10,
        heightIn: 6,
        weightLb: 8,
        maximumWeightLb: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite and greater than zero");
  });
});
