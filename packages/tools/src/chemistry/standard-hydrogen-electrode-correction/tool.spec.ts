import { describe, expect, it } from "vitest";
import { runStandardHydrogenElectrodeCorrection } from "./tool.js";

describe("Standard Hydrogen Electrode Correction Calculator", () => {
  it("calculates a valid result", () => {
    const result = runStandardHydrogenElectrodeCorrection({
      standardPotentialV: 1,
      electronsTransferred: 1,
      quotientQ: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.correctedPotentialV).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runStandardHydrogenElectrodeCorrection(null).ok).toBe(false));
});
