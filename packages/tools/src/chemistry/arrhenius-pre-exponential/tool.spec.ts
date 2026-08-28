import { describe, expect, it } from "vitest";
import { runArrheniusPreExponential } from "./tool.js";

describe("Arrhenius Pre-exponential Factor Calculator", () => {
  it("calculates a valid result", () => {
    const result = runArrheniusPreExponential({
      rateConstantK: 1,
      activationEnergyJPerMol: 1,
      temperatureK: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.preExponentialFactor).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runArrheniusPreExponential(null).ok).toBe(false));
});
