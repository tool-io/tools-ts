import { describe, expect, it } from "vitest";
import { runBondEnthalpy } from "./tool.js";

describe("Bond Enthalpy Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBondEnthalpy({
      bondsBrokenKJPerMol: 1,
      bondsFormedKJPerMol: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.reactionEnthalpyKJPerMol).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runBondEnthalpy(null).ok).toBe(false));
});
