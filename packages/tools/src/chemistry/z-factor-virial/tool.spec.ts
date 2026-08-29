import { describe, expect, it } from "vitest";
import { runZFactorVirial } from "./tool.js";

describe("Z Factor Virial Calculator", () => {
  it("calculates a valid result", () => {
    const result = runZFactorVirial({
      pressureAtm: 1,
      temperatureK: 1,
      virialBCoefficientL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.z).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runZFactorVirial(null).ok).toBe(false));
});
