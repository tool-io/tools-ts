import { describe, expect, it } from "vitest";
import { runEnthalpyCombustion } from "./tool.js";
describe("Enthalpy of Combustion Calculator", () => {
  it("calculates methane combustion", () => {
    expect(
      runEnthalpyCombustion({
        productEnthalpiesKJPerMol: [-393.5, -285.8],
        reactantEnthalpiesKJPerMol: [-103.85],
      }),
    ).toEqual({
      ok: true,
      output: { combustionEnthalpyKJPerMol: -575.4499999999999 },
    });
  });
  it("rejects invalid input", () =>
    expect(runEnthalpyCombustion(null).ok).toBe(false));
});
