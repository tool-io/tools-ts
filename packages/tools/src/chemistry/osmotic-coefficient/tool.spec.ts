import { describe, expect, it } from "vitest";
import { runOsmoticCoefficient } from "./tool.js";

describe("Osmotic Coefficient Calculator", () => {
  it("calculates a valid result", () => {
    const result = runOsmoticCoefficient({
      osmolalityOsmKg: 1,
      molalityMolKg: 1,
      vantHoffFactor: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.phi).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runOsmoticCoefficient(null).ok).toBe(false));
});
