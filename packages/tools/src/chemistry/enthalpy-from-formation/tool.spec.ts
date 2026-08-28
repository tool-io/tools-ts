import { describe, expect, it } from "vitest";
import { runEnthalpyFromFormation } from "./tool.js";

describe("Enthalpy From Formation Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runEnthalpyFromFormation({
        productFormationEnthalpies: [-393.5, -285.8],
        reactantFormationEnthalpies: [-103.85],
      }),
    ).toEqual({
      ok: true,
      output: { reactionEnthalpyKJPerMol: expect.closeTo(-575.45, 3) },
    });
  });

  it("rejects invalid input", () =>
    expect(runEnthalpyFromFormation(null).ok).toBe(false));
});
