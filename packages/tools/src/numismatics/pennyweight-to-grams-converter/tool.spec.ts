import { describe, expect, it } from "vitest";
import {
  calculatePennyweightToGramsConverter,
  example,
  runPennyweightToGramsConverter,
} from "./tool.js";

describe("numismatics/pennyweight-to-grams-converter", () => {
  it("calculates the published example", () => {
    expect(calculatePennyweightToGramsConverter(example.input)).toEqual(
      example.output,
    );
    expect(runPennyweightToGramsConverter(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runPennyweightToGramsConverter({
      ...example.input,
      pennyweights: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("checks an independent value or domain boundary", () => {
    expect(
      calculatePennyweightToGramsConverter({ pennyweights: 20 }).grams,
    ).toBe(31.1034768);
  });
});
