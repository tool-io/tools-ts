import { describe, expect, it } from "vitest";
import { runHessLaw } from "./tool.js";

describe("Hess Law Calculator", () => {
  it("calculates a valid result", () => {
    const result = runHessLaw({ stepEnthalpiesKJPerMol: [-100, 50, -25] });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.totalEnthalpyKJPerMol).toBe(-75);
  });
  it("rejects invalid input", () => expect(runHessLaw(null).ok).toBe(false));
});
