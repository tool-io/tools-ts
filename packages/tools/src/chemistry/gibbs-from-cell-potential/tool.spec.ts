import { describe, expect, it } from "vitest";
import { runGibbsFromCellPotential } from "./tool.js";

describe("Gibbs Free Energy From Cell Potential Calculator", () => {
  it("calculates a valid result", () => {
    const result = runGibbsFromCellPotential({
      cellPotentialV: 1.1,
      electronsTransferred: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.deltaGKJ).toBeCloseTo(-212.267, 2);
  });

  it("rejects invalid input", () =>
    expect(runGibbsFromCellPotential(null).ok).toBe(false));
});
