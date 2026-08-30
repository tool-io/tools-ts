import { describe, expect, it } from "vitest";
import {
  calculateDuplicateSwapValueDifference,
  example,
  runDuplicateSwapValueDifference,
} from "./tool.js";

describe("numismatics/duplicate-swap-value-difference", () => {
  it("calculates the published example", () => {
    expect(calculateDuplicateSwapValueDifference(example.input)).toEqual(
      example.output,
    );
    expect(runDuplicateSwapValueDifference(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runDuplicateSwapValueDifference({
      ...example.input,
      receivedCoinValue: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
