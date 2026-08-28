import { describe, expect, it } from "vitest";
import { runMolarConductivity } from "./tool.js";

describe("Molar Conductivity Calculator", () => {
  it("calculates a valid result", () => {
    const result = runMolarConductivity({
      conductivitySCm: 1,
      concentrationMolL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.molarConductivitySCm2Mol).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runMolarConductivity(null).ok).toBe(false));
});
