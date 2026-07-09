import { describe, expect, it } from "vitest";
import { runStandardScore } from "./tool.js";
describe("Standardize Dataset Tool", () => {
  it("calculates a valid result", () => {
    const result = runStandardScore({ values: [1, 2, 3] });
    expect(result.ok && result.output.values).toEqual([
      -Math.sqrt(1.5),
      0,
      Math.sqrt(1.5),
    ]);
  });
  it("rejects invalid input", () =>
    expect(runStandardScore(null).ok).toBe(false));
});
