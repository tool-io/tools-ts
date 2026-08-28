import { describe, expect, it } from "vitest";
import { runPhenolphthaleinRangeChecker } from "./tool.js";

describe("Phenolphthalein Range Checker", () => {
  it("calculates a valid result", () => {
    const result = runPhenolphthaleinRangeChecker({ ph: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.inRange).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runPhenolphthaleinRangeChecker(null).ok).toBe(false));
});
