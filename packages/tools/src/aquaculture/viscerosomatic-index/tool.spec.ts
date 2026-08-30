import { describe, expect, it } from "vitest";
import {
  calculateViscerosomaticIndex,
  example,
  runViscerosomaticIndex,
} from "./tool.js";

describe("aquaculture/viscerosomatic-index", () => {
  it("calculates the published example", () => {
    expect(calculateViscerosomaticIndex(example.input)).toEqual(example.output);
    expect(runViscerosomaticIndex(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("rejects a non-finite input", () => {
    const result = runViscerosomaticIndex({
      ...example.input,
      visceraWeightGrams: Number.NaN,
    });
    expect(result.ok).toBe(false);
  });
  it("rejects a zero denominator", () => {
    expect(
      runViscerosomaticIndex({ ...example.input, bodyWeightGrams: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "bodyWeightGrams" }] },
    });
  });
});
