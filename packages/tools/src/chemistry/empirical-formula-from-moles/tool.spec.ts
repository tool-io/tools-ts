import { describe, expect, it } from "vitest";
import { runEmpiricalFormulaFromMoles } from "./tool.js";

describe("Empirical Formula From Moles Calculator", () => {
  it("calculates a valid result", () => {
    expect(
      runEmpiricalFormulaFromMoles({
        elements: ["C", "H", "O"],
        moles: [0.0125, 0.025, 0.0125],
      }),
    ).toEqual({
      ok: true,
      output: { ratios: { C: 1, H: 2, O: 1 } },
    });
  });

  it("rejects invalid input", () =>
    expect(runEmpiricalFormulaFromMoles(null).ok).toBe(false));
});
