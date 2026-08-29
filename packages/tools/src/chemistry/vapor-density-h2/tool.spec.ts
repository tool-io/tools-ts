import { describe, expect, it } from "vitest";
import { runVaporDensityH2 } from "./tool.js";

describe("Vapor Density Relative to H2 Calculator", () => {
  it("calculates a valid result for oxygen", () => {
    const result = runVaporDensityH2({ gasMolarMassGMol: 32 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.vaporDensityH2).toBeCloseTo(15.873, 3);
  });

  it("rejects invalid input", () =>
    expect(runVaporDensityH2(null).ok).toBe(false));
});
