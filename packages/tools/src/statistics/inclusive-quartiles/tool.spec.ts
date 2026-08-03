import { describe, expect, it } from "vitest";
import {
  calculateInclusiveQuartiles,
  inclusiveQuartilesExample,
  runInclusiveQuartiles,
} from "./tool.js";

describe("Inclusive Quartiles Calculator", () => {
  it.each([
    [
      [1, 2, 3, 4, 5],
      [2, 3, 4],
    ],
    [
      [10, 20, 30, 40],
      [15, 25, 35],
    ],
    [
      [1, 2, 3],
      [1.5, 2, 2.5],
    ],
    [[42], [42, 42, 42]],
  ])("calculates inclusive quartiles", (values, expected) => {
    expect(calculateInclusiveQuartiles(values)).toEqual(expected);
  });

  it("rejects empty and non-finite datasets", () => {
    expect(calculateInclusiveQuartiles([])).toBeNull();
    expect(calculateInclusiveQuartiles([1, Number.NaN, 3])).toBeNull();
  });

  it("publishes an executable example", () =>
    expect(runInclusiveQuartiles(inclusiveQuartilesExample.input)).toEqual({
      ok: true,
      output: inclusiveQuartilesExample.output,
    }));
});
