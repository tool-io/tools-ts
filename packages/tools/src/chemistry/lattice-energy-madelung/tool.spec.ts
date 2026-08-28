import { describe, expect, it } from "vitest";
import { runLatticeEnergyMadelung } from "./tool.js";
describe("Lattice Energy Madelung", () => {
  it("calculates a valid result", () =>
    expect(
      runLatticeEnergyMadelung({
        interionicDistanceNm: 0.276,
        madelungConstant: 1.7476,
        zPlusZMinusProduct: 1,
      }),
    ).toEqual({
      ok: true,
      output: { latticeEnergyKJPerMol: -879.7232052652174 },
    }));
  it("rejects invalid input", () =>
    expect(
      runLatticeEnergyMadelung({
        interionicDistanceNm: 0,
        madelungConstant: 1.7476,
        zPlusZMinusProduct: 1,
      }).ok,
    ).toBe(false));
});
