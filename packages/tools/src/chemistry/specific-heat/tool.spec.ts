import { describe, expect, it } from "vitest";
import { runSpecificHeat } from "./tool.js";

describe("Specific Heat Calculator", () => {
  it("calculates a valid result", () => {
    const result = runSpecificHeat({ deltaTK: 1, heatJoules: 1, massG: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.specificHeatJGK).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runSpecificHeat(null).ok).toBe(false));
});
