import { describe, expect, it } from "vitest";
import { runHessLawReactionEnthalpy } from "./tool.js";
describe("Hess Law Enthalpy", () => {
  it("calculates a valid result", () =>
    expect(
      runHessLawReactionEnthalpy({
        sumProductsKJ: 125.75,
        sumReactantsKJ: 250.25,
      }),
    ).toEqual({
      ok: true,
      output: { reactionEnthalpyKJ: -124.5 },
    }));
  it("rejects invalid input", () =>
    expect(
      runHessLawReactionEnthalpy({
        sumProductsKJ: Number.POSITIVE_INFINITY,
        sumReactantsKJ: 1,
      }).ok,
    ).toBe(false));
});
