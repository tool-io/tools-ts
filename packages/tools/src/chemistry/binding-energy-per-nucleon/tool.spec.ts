import { describe, expect, it } from "vitest";
import { runBindingEnergyPerNucleon } from "./tool.js";

describe("Binding Energy Per Nucleon Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBindingEnergyPerNucleon({
      massDefectU: 0.030377,
      nucleonCount: 4,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.meVPerNucleon).toBeCloseTo(7.0741, 3);
  });

  it("rejects invalid input", () =>
    expect(runBindingEnergyPerNucleon(null).ok).toBe(false));
});
