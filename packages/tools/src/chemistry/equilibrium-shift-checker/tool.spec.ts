import { describe, expect, it } from "vitest";
import { runEquilibriumShiftChecker } from "./tool.js";

describe("Equilibrium Shift Checker", () => {
  it("classifies all three shift directions", () => {
    expect(runEquilibriumShiftChecker({ k: 1, quotient: 2 })).toEqual({
      ok: true,
      output: { shift: "toward reactants" },
    });
    expect(runEquilibriumShiftChecker({ k: 2, quotient: 1 })).toEqual({
      ok: true,
      output: { shift: "toward products" },
    });
    expect(runEquilibriumShiftChecker({ k: 1, quotient: 1 })).toEqual({
      ok: true,
      output: { shift: "no change" },
    });
  });

  it("rejects invalid input", () =>
    expect(runEquilibriumShiftChecker(null).ok).toBe(false));
});
