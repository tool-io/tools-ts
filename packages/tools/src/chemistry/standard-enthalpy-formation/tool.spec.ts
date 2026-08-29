import { describe, expect, it } from "vitest";
import { runStandardEnthalpyFormation } from "./tool.js";
describe("Formation Enthalpy Sum", () => {
  it("calculates a valid result", () =>
    expect(
      runStandardEnthalpyFormation({
        formationEnthalpyKJPerMol: -285.83,
        moles: 2,
      }),
    ).toEqual({
      ok: true,
      output: { totalEnthalpyKJ: -571.66 },
    }));
  it("rejects invalid input", () =>
    expect(
      runStandardEnthalpyFormation({
        formationEnthalpyKJPerMol: -285.83,
        moles: 0,
      }).ok,
    ).toBe(false));
});
