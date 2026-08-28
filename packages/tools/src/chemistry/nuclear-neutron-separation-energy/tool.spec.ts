import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateNeutronSeparationEnergy,
  neutronSeparationEnergyExample,
  neutronSeparationEnergyTool,
} from "./tool.js";

describe("neutron separation energy", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateNeutronSeparationEnergy(neutronSeparationEnergyExample.input),
    ).toEqual({
      ok: true,
      output: neutronSeparationEnergyExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(neutronSeparationEnergyTool)).toEqual([]);
  });

  it("can report an unbound negative separation energy", () => {
    const result = calculateNeutronSeparationEnergy({
      daughterMassKg: 0.1e-27,
      parentMassKg: 2e-27,
    });
    expect(result).toMatchObject({ ok: true });
    if (result.ok) expect(result.output.separationEnergyJ).toBeLessThan(0);
  });
});
