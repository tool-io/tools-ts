import { describe, expect, it } from "vitest";
import { runWeightForce } from "./tool.js";

describe("Weight Force Calculator", () => {
  it("computes weight for 5 kg", () => {
    const result = runWeightForce({ massKg: 5 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.weightNewtons).toBeCloseTo(49.05, 1);
  });

  it("rejects invalid input", () =>
    expect(runWeightForce(null).ok).toBe(false));
});
