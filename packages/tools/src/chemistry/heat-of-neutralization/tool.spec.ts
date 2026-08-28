import { describe, expect, it } from "vitest";
import { runHeatOfNeutralization } from "./tool.js";

describe("Heat of Neutralization Calculator", () => {
  it("calculates a valid result", () => {
    const result = runHeatOfNeutralization({ heatReleasedJ: 1, molesWater: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.neutralizationEnthalpyKJPerMol).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runHeatOfNeutralization(null).ok).toBe(false));
});
