import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateParticleInBoxEnergy,
  particleInBoxEnergyExample,
  particleInBoxEnergyTool,
} from "./tool.js";

describe("particle in a box energy", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateParticleInBoxEnergy(particleInBoxEnergyExample.input),
    ).toEqual({
      ok: true,
      output: particleInBoxEnergyExample.output,
    });
  });

  it("publishes a portable example and valid pure contract", () => {
    expect(JSON.parse(JSON.stringify(particleInBoxEnergyExample))).toEqual(
      particleInBoxEnergyExample,
    );
    expect(validateToolContract(particleInBoxEnergyTool)).toEqual([]);
  });

  it("scales quadratically with the quantum number and inversely with length squared", () => {
    const input = particleInBoxEnergyExample.input;
    const base = calculateParticleInBoxEnergy(input);
    const doubledQuantumNumber = calculateParticleInBoxEnergy({
      ...input,
      quantumNumber: 2,
    });
    const doubledLength = calculateParticleInBoxEnergy({
      ...input,
      boxLengthM: 2,
    });
    if (!base.ok || !doubledQuantumNumber.ok || !doubledLength.ok)
      throw new Error("expected valid energy calculations");
    expect(doubledQuantumNumber.output.energyJ).toBeCloseTo(
      base.output.energyJ * 4,
      12,
    );
    expect(doubledLength.output.energyJ).toBeCloseTo(
      base.output.energyJ / 4,
      12,
    );
  });

  it("rejects malformed and non-positive inputs", () => {
    expect(calculateParticleInBoxEnergy(undefined)).toMatchObject({
      error: { issues: [{ code: "object_required" }] },
      ok: false,
    });
    expect(
      calculateParticleInBoxEnergy({
        ...particleInBoxEnergyExample.input,
        quantumNumber: 1.5,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "positive_safe_integer_required", field: "quantumNumber" },
        ],
      },
      ok: false,
    });
    expect(
      calculateParticleInBoxEnergy({
        ...particleInBoxEnergyExample.input,
        massKg: 0,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "positive_finite_number_required", field: "massKg" }],
      },
      ok: false,
    });
  });

  it("rejects unknown and non-finite values", () => {
    expect(
      calculateParticleInBoxEnergy({
        ...particleInBoxEnergyExample.input,
        extra: true,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    expect(
      calculateParticleInBoxEnergy({
        ...particleInBoxEnergyExample.input,
        boxLengthM: Number.NaN,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "positive_finite_number_required", field: "boxLengthM" },
        ],
      },
      ok: false,
    });
  });
});
