import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateHaberBoschEquilibrium,
  haberBoschEquilibriumExample,
  haberBoschEquilibriumTool,
} from "./tool.js";

describe("Haber-Bosch equilibrium", () => {
  it("reproduces the canonical example", () => {
    expect(
      calculateHaberBoschEquilibrium(haberBoschEquilibriumExample.input),
    ).toEqual({
      ok: true,
      output: haberBoschEquilibriumExample.output,
    });
  });

  it("publishes a valid pure contract", () => {
    expect(validateToolContract(haberBoschEquilibriumTool)).toEqual([]);
  });

  it("rejects zero reactant concentration", () => {
    expect(
      calculateHaberBoschEquilibrium({
        ...haberBoschEquilibriumExample.input,
        hydrogenConcentrationMolPerL: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "positive_finite_number_required" }] },
      ok: false,
    });
  });
});
