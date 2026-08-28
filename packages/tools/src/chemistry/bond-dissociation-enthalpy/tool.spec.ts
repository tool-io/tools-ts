import { describe, expect, it } from "vitest";
import { runBondDissociationEnthalpy } from "./tool.js";
describe("BDE Average", () => {
  it("calculates a valid result", () =>
    expect(
      runBondDissociationEnthalpy({ bondCountInt: 4, totalBondEnergyKJ: 1652 }),
    ).toEqual({
      ok: true,
      output: { averageBondEnthalpyKJPerMol: 413 },
    }));
  it("rejects invalid input", () =>
    expect(
      runBondDissociationEnthalpy({ bondCountInt: 0, totalBondEnergyKJ: 1652 })
        .ok,
    ).toBe(false));
});
