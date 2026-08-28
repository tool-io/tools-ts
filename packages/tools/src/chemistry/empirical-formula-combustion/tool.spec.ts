import { describe, expect, it } from "vitest";
import { runEmpiricalFormulaCombustion } from "./tool.js";

describe("Empirical Formula From Combustion Calculator", () => {
  it("calculates a valid result for methane", () => {
    const result = runEmpiricalFormulaCombustion({
      co2MassG: 44.0095,
      h2oMassG: 36.03056,
    });
    if (!result.ok) throw new Error("expected success");
    const ratios = result.output.ratios as Record<string, number>;
    expect(ratios.C).toBeCloseTo(1, 2);
    expect(ratios.H).toBeCloseTo(4, 2);
  });

  it("rejects invalid input", () =>
    expect(runEmpiricalFormulaCombustion(null).ok).toBe(false));
});
