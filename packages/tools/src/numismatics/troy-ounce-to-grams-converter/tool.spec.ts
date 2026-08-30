import { describe, expect, it } from "vitest";
import {
  calculateTroyOunceToGramsConverter,
  example,
  runTroyOunceToGramsConverter,
} from "./tool.js";

describe("numismatics/troy-ounce-to-grams-converter", () => {
  it("calculates the published example", () => {
    expect(calculateTroyOunceToGramsConverter(example.input)).toEqual(
      example.output,
    );
    expect(runTroyOunceToGramsConverter(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runTroyOunceToGramsConverter({
      ...example.input,
      troyOunces: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(calculateTroyOunceToGramsConverter({ troyOunces: 1 }).grams).toBe(
      31.1034768,
    );
  });
});
