import { describe, expect, it } from "vitest";
import { runEmpiricalFormulaCombustionCo2H2o } from "./tool.js";

describe("Empirical Formula From CO2 and H2O Calculator", () => {
  it("derives CH4 for methane combustion", () => {
    const result = runEmpiricalFormulaCombustionCo2H2o({
      co2MassG: 44.0095,
      h2oMassG: 36.03056,
    });
    if (!result.ok) throw new Error("expected success");
    const subscripts = result.output.subscripts as Record<string, number>;
    expect(subscripts.C).toBe(1);
    expect(subscripts.H).toBe(4);
  });

  it("rejects invalid input", () =>
    expect(runEmpiricalFormulaCombustionCo2H2o(null).ok).toBe(false));
});
