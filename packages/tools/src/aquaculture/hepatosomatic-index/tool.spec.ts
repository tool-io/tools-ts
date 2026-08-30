import { describe, expect, it } from "vitest";
import {
  calculateHepatosomaticIndex,
  example,
  runHepatosomaticIndex,
} from "./tool.js";

describe("aquaculture/hepatosomatic-index", () => {
  it("calculates the published example", () => {
    expect(calculateHepatosomaticIndex(example.input)).toEqual(example.output);
    expect(runHepatosomaticIndex(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runHepatosomaticIndex({
      ...example.input,
      liverWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runHepatosomaticIndex({ ...example.input, bodyWeightGrams: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "bodyWeightGrams" }] },
    });
  });
});
