import { describe, expect, it } from "vitest";
import { runCurrentEfficiency } from "./tool.js";

describe("Current Efficiency Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCurrentEfficiency({
      actualOutput: 1,
      theoreticalOutput: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.efficiencyPercent).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runCurrentEfficiency(null).ok).toBe(false));
});
