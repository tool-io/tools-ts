import { describe, expect, it } from "vitest";
import { runKineticEnergyGas } from "./tool.js";

describe("Kinetic Energy Gas Calculator", () => {
  it("calculates a valid result", () => {
    const result = runKineticEnergyGas({ temperatureK: 1 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.kineticEnergyJ).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runKineticEnergyGas(null).ok).toBe(false));
});
