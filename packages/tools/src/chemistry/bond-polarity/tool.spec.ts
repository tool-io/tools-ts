import { describe, expect, it } from "vitest";
import { runBondPolarity } from "./tool.js";

describe("Bond Polarity Calculator", () => {
  it("computes EN difference for H-F bond", () => {
    const result = runBondPolarity({ enA: 2.2, enB: 3.98 });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected success");
    expect(result.output.deltaEn).toBeCloseTo(1.78, 1);
  });

  it("rejects invalid input", () =>
    expect(runBondPolarity(null).ok).toBe(false));
});
