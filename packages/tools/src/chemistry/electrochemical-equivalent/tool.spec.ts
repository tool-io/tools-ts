import { describe, expect, it } from "vitest";
import { runElectrochemicalEquivalent } from "./tool.js";

describe("Electrochemical Equivalent Calculator", () => {
  it("calculates a valid result", () => {
    const result = runElectrochemicalEquivalent({
      molarMassGMol: 1,
      valence: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.electrochemicalEquivalentGMolC).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runElectrochemicalEquivalent(null).ok).toBe(false));
});
