import { describe, expect, it } from "vitest";
import { runSolutionEnthalpyMixing } from "./tool.js";
describe("Mixing Enthalpy", () => {
  it("calculates a valid result", () =>
    expect(
      runSolutionEnthalpyMixing({
        enthalpyAKJPerMol: -100,
        enthalpyBKJPerMol: 50,
        mixtureEnthalpyKJPerMol: -20,
        moleFractionA: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { mixingEnthalpyKJPerMol: 5 },
    }));
  it("rejects invalid input", () =>
    expect(
      runSolutionEnthalpyMixing({
        enthalpyAKJPerMol: -100,
        enthalpyBKJPerMol: 50,
        mixtureEnthalpyKJPerMol: -20,
        moleFractionA: 1.5,
      }).ok,
    ).toBe(false));
});
