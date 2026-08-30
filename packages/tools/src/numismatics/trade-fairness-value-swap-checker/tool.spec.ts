import { describe, expect, it } from "vitest";
import {
  calculateTradeFairnessValueSwapChecker,
  example,
  runTradeFairnessValueSwapChecker,
} from "./tool.js";

describe("numismatics/trade-fairness-value-swap-checker", () => {
  it("calculates the published example", () => {
    expect(calculateTradeFairnessValueSwapChecker(example.input)).toEqual(
      example.output,
    );
    expect(runTradeFairnessValueSwapChecker(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runTradeFairnessValueSwapChecker({
      ...example.input,
      valueReceived: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
