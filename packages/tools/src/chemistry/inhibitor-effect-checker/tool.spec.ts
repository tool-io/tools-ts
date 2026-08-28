import { describe, expect, it } from "vitest";
import { runInhibitorEffectChecker } from "./tool.js";

describe("Inhibitor Effect Check", () => {
  it("calculates a valid result", () => {
    const result = runInhibitorEffectChecker({
      inhibitorConcentrationMolL: 1,
      kiMolL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.activityFraction).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runInhibitorEffectChecker(null).ok).toBe(false));
});
