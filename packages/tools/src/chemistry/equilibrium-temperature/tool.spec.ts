import { describe, expect, it } from "vitest";
import { runEquilibriumTemperature } from "./tool.js";
describe("Equilibrium Temperature Calculator", () => {
  it("30 kJ/mol and 100 J/mol/K gives 300 K", () => {
    expect(
      runEquilibriumTemperature({ deltaHKJPerMol: 30, deltaSJPerMolK: 100 }),
    ).toEqual({ ok: true, output: { temperatureK: 300 } });
  });
  it("rejects a zero entropy change", () =>
    expect(
      runEquilibriumTemperature({ deltaHKJPerMol: 30, deltaSJPerMolK: 0 }).ok,
    ).toBe(false));
  it("rejects invalid input", () =>
    expect(runEquilibriumTemperature(null).ok).toBe(false));
});
