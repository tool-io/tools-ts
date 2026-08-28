import { describe, expect, it } from "vitest";
import { runGibbsHelmholtz } from "./tool.js";

describe("Gibbs-Helmholtz Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runGibbsHelmholtz({
        entropyChangeJPerMolK: 100,
        enthalpyChangeKJPerMol: -200,
        temperatureK: 298,
      }),
    ).toEqual({
      ok: true,
      output: { gibbsFreeEnergyKJPerMol: expect.closeTo(-229.8, 6) },
    });
  });

  it("rejects invalid input", () =>
    expect(runGibbsHelmholtz(null).ok).toBe(false));
});
