import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateKineticEnergy,
  kineticEnergyExample,
  kineticEnergyTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateKineticEnergy>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Kinetic Energy", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = kineticEnergyTool.execute(kineticEnergyExample.input);
    expect(result).toEqual({ ok: true, output: kineticEnergyExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(kineticEnergyTool.id).toBe("physics/kinetic-energy");
    expect(validateToolContract(kineticEnergyTool)).toEqual([]);
  });

  it("allows zero speed and scales quadratically", () => {
    const rest = calculateKineticEnergy({ massKg: 5, speedMs: 0 });
    expect(rest.ok).toBe(true);
    if (rest.ok) expect(rest.output.joules).toBe(0);
    const doubled = calculateKineticEnergy({ massKg: 2, speedMs: 6 });
    expect(doubled.ok).toBe(true);
    // Doubling speed quadruples energy.
    if (doubled.ok) expect(doubled.output.joules).toBe(36);
  });

  it("rejects malformed probes", () => {
    expect(calculateKineticEnergy(null).ok).toBe(false);
    expect(issueCodes(calculateKineticEnergy({}))).toEqual([
      "mass_kg_required",
      "speed_ms_required",
    ]);
    expect(
      issueCodes(calculateKineticEnergy({ massKg: -1, speedMs: 3 })),
    ).toEqual(["mass_kg_invalid"]);
    expect(
      issueCodes(calculateKineticEnergy({ massKg: 2, speedMs: -3 })),
    ).toEqual(["speed_ms_invalid"]);
    expect(issueCodes(calculateKineticEnergy({ extra: true, massKg: 1, speedMs: 1 }))).toEqual([
      "unknown_field",
    ]);
  });
});
