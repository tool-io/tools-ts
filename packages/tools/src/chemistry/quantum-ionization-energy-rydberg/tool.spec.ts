import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateIonizationEnergyRydberg,
  ionizationEnergyRydbergExample,
  ionizationEnergyRydbergTool,
} from "./tool.js";

describe("Rydberg ionization energy", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateIonizationEnergyRydberg(ionizationEnergyRydbergExample.input),
    ).toEqual({
      ok: true,
      output: ionizationEnergyRydbergExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(ionizationEnergyRydbergTool)).toEqual([]);
  });

  it("scales with atomic number squared", () => {
    const base = calculateIonizationEnergyRydberg(
      ionizationEnergyRydbergExample.input,
    );
    const doubled = calculateIonizationEnergyRydberg({
      ...ionizationEnergyRydbergExample.input,
      atomicNumber: 2,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected valid energies");
    expect(doubled.output.ionizationEnergyJ).toBeCloseTo(
      base.output.ionizationEnergyJ * 4,
      12,
    );
  });
});
