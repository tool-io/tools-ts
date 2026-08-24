import { describe, expect, it } from "vitest";
import {
  ledInternalQuantumEfficiencyExample,
  runLedInternalQuantumEfficiency,
} from "./tool.js";

describe("led internal quantum efficiency calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runLedInternalQuantumEfficiency(
        ledInternalQuantumEfficiencyExample.input,
      ),
    ).toEqual({ ok: true, output: ledInternalQuantumEfficiencyExample.output });
  });

  it("returns fifty percent for symmetric lifetimes", () => {
    const result = runLedInternalQuantumEfficiency({
      nonRadiativeLifetimeNs: 7,
      radiativeLifetimeNs: 7,
    });
    expect(result).toEqual({
      ok: true,
      output: { internalQuantumEfficiencyPercent: 50 },
    });
  });

  it("approaches one hundred percent when non-radiative lifetime dominates", () => {
    const result = runLedInternalQuantumEfficiency({
      nonRadiativeLifetimeNs: 999,
      radiativeLifetimeNs: 1,
    });
    expect(result).toEqual({
      ok: true,
      output: { internalQuantumEfficiencyPercent: 99.9 },
    });
  });

  it("approaches zero percent when radiative lifetime dominates", () => {
    const result = runLedInternalQuantumEfficiency({
      nonRadiativeLifetimeNs: 1,
      radiativeLifetimeNs: 9,
    });
    expect(result).toEqual({
      ok: true,
      output: { internalQuantumEfficiencyPercent: 10 },
    });
  });

  it("is complementary when lifetimes are swapped", () => {
    const first = runLedInternalQuantumEfficiency({
      nonRadiativeLifetimeNs: 30,
      radiativeLifetimeNs: 70,
    });
    const second = runLedInternalQuantumEfficiency({
      nonRadiativeLifetimeNs: 70,
      radiativeLifetimeNs: 30,
    });
    if (!first.ok || !second.ok) throw new Error("expected success");
    expect(
      (first.output.internalQuantumEfficiencyPercent as number) +
        (second.output.internalQuantumEfficiencyPercent as number),
    ).toBeCloseTo(100, 12);
  });

  it("rejects zero and negative radiative lifetime", () => {
    for (const tau of [0, -5])
      expect(
        runLedInternalQuantumEfficiency({
          nonRadiativeLifetimeNs: 40,
          radiativeLifetimeNs: tau,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects zero and negative non-radiative lifetime", () => {
    for (const tau of [0, -5])
      expect(
        runLedInternalQuantumEfficiency({
          nonRadiativeLifetimeNs: tau,
          radiativeLifetimeNs: 10,
        }),
      ).toMatchObject({
        error: { issues: [{ code: "invalid_field" }] },
        ok: false,
      });
  });

  it("rejects missing and non-finite inputs", () => {
    expect(
      runLedInternalQuantumEfficiency({ radiativeLifetimeNs: 10 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(
      runLedInternalQuantumEfficiency({
        nonRadiativeLifetimeNs: Number.POSITIVE_INFINITY,
        radiativeLifetimeNs: 10,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
  });
});
