import { describe, expect, it } from "vitest";
import {
  calculateSterlingToFineSilverConvert,
  example,
  runSterlingToFineSilverConvert,
} from "./tool.js";

describe("numismatics/sterling-to-fine-silver-convert", () => {
  it("calculates the published example", () => {
    expect(calculateSterlingToFineSilverConvert(example.input)).toEqual(
      example.output,
    );
    expect(runSterlingToFineSilverConvert(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runSterlingToFineSilverConvert({
      ...example.input,
      sterlingMassGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculateSterlingToFineSilverConvert({ sterlingMassGrams: 100 })
        .fineSilverGrams,
    ).toBe(92.5);
  });
});
