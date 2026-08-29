import { describe, expect, it } from "vitest";
import { runTheoreticalYield, theoreticalYieldExample } from "./tool.js";

describe("Theoretical Yield Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTheoreticalYield(theoreticalYieldExample.input)).toEqual({
      ok: true,
      output: theoreticalYieldExample.output,
    });
  });

  it("doubles the yield for a factor of two", () => {
    expect(
      runTheoreticalYield({
        limitingMoles: 0.25,
        productMolarMassGPerMol: 64,
        stoichiometricFactor: 2,
      }),
    ).toEqual({
      ok: true,
      output: { theoreticalYieldGrams: 32 },
    });
  });

  it("yields zero grams for a zero stoichiometric factor", () => {
    expect(
      runTheoreticalYield({
        limitingMoles: 2,
        productMolarMassGPerMol: 30,
        stoichiometricFactor: 0,
      }),
    ).toEqual({
      ok: true,
      output: { theoreticalYieldGrams: 0 },
    });
  });

  it("computes whole-number gram amounts", () => {
    expect(
      runTheoreticalYield({
        limitingMoles: 4,
        productMolarMassGPerMol: 25,
      }),
    ).toEqual({
      ok: true,
      output: { theoreticalYieldGrams: 100 },
    });
  });

  it("rejects a non-positive limiting amount", () => {
    expect(
      runTheoreticalYield({ limitingMoles: 0, productMolarMassGPerMol: 180 })
        .ok,
    ).toBe(false);
  });

  it("rejects a negative product molar mass", () => {
    expect(
      runTheoreticalYield({ limitingMoles: 1, productMolarMassGPerMol: -180 })
        .ok,
    ).toBe(false);
  });

  it("rejects a negative stoichiometric factor", () => {
    expect(
      runTheoreticalYield({
        limitingMoles: 1,
        productMolarMassGPerMol: 180,
        stoichiometricFactor: -1,
      }).ok,
    ).toBe(false);
  });

  it("requires the two primary inputs", () => {
    expect(runTheoreticalYield({ limitingMoles: 1 }).ok).toBe(false);
    expect(runTheoreticalYield({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runTheoreticalYield(90).ok).toBe(false);
  });
});
