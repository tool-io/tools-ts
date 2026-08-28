import { describe, expect, it } from "vitest";
import { runConductivityFromConcentration } from "./tool.js";

describe("Conductivity From Concentration Calculator", () => {
  it("calculates a valid result", () => {
    const result = runConductivityFromConcentration({
      molarConductivitySCm2Mol: 1,
      concentrationMolL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.conductivitySCm).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runConductivityFromConcentration(null).ok).toBe(false));
});
