import { describe, expect, it } from "vitest";
import { runBombCalorimeterEnergy } from "./tool.js";

describe("Bomb Calorimeter Energy Calculator", () => {
  it("calculates a valid result", () => {
    const result = runBombCalorimeterEnergy({
      calorimeterCapacityJK: 1,
      deltaTK: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.combustionEnergyJ).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runBombCalorimeterEnergy(null).ok).toBe(false));
  it("rejects zero calorimeter heat capacity", () =>
    expect(
      runBombCalorimeterEnergy({ calorimeterCapacityJK: 0, deltaTK: 1 }).ok,
    ).toBe(false));
});
