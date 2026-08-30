import { describe, expect, it } from "vitest";
import {
  calculateGonadosomaticIndex,
  example,
  runGonadosomaticIndex,
} from "./tool.js";

describe("aquaculture/gonadosomatic-index", () => {
  it("calculates the published example", () => {
    expect(calculateGonadosomaticIndex(example.input)).toEqual(example.output);
    expect(runGonadosomaticIndex(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runGonadosomaticIndex({
      ...example.input,
      gonadWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runGonadosomaticIndex({ ...example.input, bodyWeightGrams: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "bodyWeightGrams" }] },
    });
  });
});
