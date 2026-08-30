import { describe, expect, it } from "vitest";
import {
  calculateGramsToTroyOuncesConverter,
  example,
  runGramsToTroyOuncesConverter,
} from "./tool.js";

describe("numismatics/grams-to-troy-ounces-converter", () => {
  it("calculates the published example", () => {
    expect(calculateGramsToTroyOuncesConverter(example.input)).toEqual(
      example.output,
    );
    expect(runGramsToTroyOuncesConverter(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runGramsToTroyOuncesConverter({
      ...example.input,
      grams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
});
