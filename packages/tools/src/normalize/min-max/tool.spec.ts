import { describe, expect, it } from "vitest";
import { runMinMax } from "./tool.js";
describe("Min-Max Normalization Tool", () => {
  it("calculates a valid result", () => {
    expect(
      runMinMax({ values: [10, 20, 30], targetMinimum: 0, targetMaximum: 1 }),
    ).toEqual({
      ok: true,
      output: { values: [0, 0.5, 1], sourceMinimum: 10, sourceMaximum: 30 },
    });
  });
  it("rejects invalid input", () => expect(runMinMax(null).ok).toBe(false));
});
