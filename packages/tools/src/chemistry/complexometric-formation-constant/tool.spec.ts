import { describe, expect, it } from "vitest";
import { runComplexometricFormationConstant } from "./tool.js";
describe("Formation Constant Beta", () => {
  it("calculates a valid result", () =>
    expect(
      runComplexometricFormationConstant({
        complexConcM: 0.01,
        ligandConcM: 0.05,
        ligandCountInt: 2,
        metalIonM: 0.02,
      }),
    ).toEqual({
      ok: true,
      output: { formationConstantBeta: 199.99999999999997 },
    }));
  it("rejects invalid input", () =>
    expect(
      runComplexometricFormationConstant({
        complexConcM: 0.01,
        ligandConcM: 0.05,
        ligandCountInt: 2,
        metalIonM: 0,
      }).ok,
    ).toBe(false));
});
