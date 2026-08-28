import { describe, expect, it } from "vitest";
import { runBondEnergy } from "./tool.js";

describe("Bond Energy Calculator", () => {
  it("computes total energy for 4 bonds at 350 kJ/mol", () => {
    expect(runBondEnergy({ energyPerBondKJPerMol: 350, numBonds: 4 })).toEqual({
      ok: true,
      output: { totalEnergyKJPerMol: 1400 },
    });
  });

  it("rejects invalid input", () => expect(runBondEnergy(null).ok).toBe(false));
});
