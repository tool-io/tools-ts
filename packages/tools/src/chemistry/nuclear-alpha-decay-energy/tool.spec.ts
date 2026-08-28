import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  alphaDecayEnergyExample,
  alphaDecayEnergyTool,
  calculateAlphaDecayEnergy,
} from "./tool.js";

describe("alpha decay energy", () => {
  it("reproduces the canonical example", () => {
    expect(calculateAlphaDecayEnergy(alphaDecayEnergyExample.input)).toEqual({
      ok: true,
      output: alphaDecayEnergyExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(alphaDecayEnergyTool)).toEqual([]);
  });

  it("can return a negative Q value for an energetically closed decay", () => {
    const result = calculateAlphaDecayEnergy({
      daughterMassKg: 2e-26,
      parentMassKg: 1e-26,
    });
    expect(result).toMatchObject({ ok: true });
    if (result.ok) expect(result.output.qValueJ).toBeLessThan(0);
  });
});
