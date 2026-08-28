import { describe, expect, it } from "vitest";
import { runExcessEnthalpy } from "./tool.js";
describe("Excess Enthalpy", () => {
  it("calculates a valid result", () =>
    expect(
      runExcessEnthalpy({ actualMixKJPerMol: 45.5, idealMixKJPerMol: 40 }),
    ).toEqual({
      ok: true,
      output: { excessEnthalpyKJPerMol: 5.5 },
    }));
  it("rejects invalid input", () =>
    expect(
      runExcessEnthalpy({
        actualMixKJPerMol: Number.NaN,
        idealMixKJPerMol: 40,
      }).ok,
    ).toBe(false));
});
