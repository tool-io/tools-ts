import { describe, expect, it } from "vitest";
import {
  calculateLengthWeightConversion,
  example,
  runLengthWeightConversion,
} from "./tool.js";

describe("aquaculture/length-weight-conversion", () => {
  it("calculates the published example", () => {
    expect(calculateLengthWeightConversion(example.input)).toEqual(
      example.output,
    );
    expect(runLengthWeightConversion(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runLengthWeightConversion({
      ...example.input,
      weightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
