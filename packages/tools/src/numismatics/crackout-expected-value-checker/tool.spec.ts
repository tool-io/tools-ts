import { describe, expect, it } from "vitest";
import {
  calculateCrackoutExpectedValueChecker,
  example,
  runCrackoutExpectedValueChecker,
} from "./tool.js";

describe("numismatics/crackout-expected-value-checker", () => {
  it("calculates the published example", () => {
    expect(calculateCrackoutExpectedValueChecker(example.input)).toEqual(
      example.output,
    );
    expect(runCrackoutExpectedValueChecker(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runCrackoutExpectedValueChecker({
      ...example.input,
      upgradeProbabilityPercent: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
