import { describe, expect, it } from "vitest";
import { runCellPotentialFromGibbs } from "./tool.js";

describe("Cell Potential From Gibbs Calculator", () => {
  it("calculates a valid result", () => {
    const result = runCellPotentialFromGibbs({
      deltaGJ: -212700,
      electronsTransferred: 2,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.cellPotentialV).toBeCloseTo(1.102, 2);
  });

  it("rejects invalid input", () =>
    expect(runCellPotentialFromGibbs(null).ok).toBe(false));
});
