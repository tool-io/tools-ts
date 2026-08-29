import { describe, expect, it } from "vitest";
import {
  runSolutionMassForMolarity,
  solutionMassForMolarityExample,
} from "./tool.js";

describe("Solute Mass For Molarity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSolutionMassForMolarity(solutionMassForMolarityExample.input),
    ).toEqual({
      ok: true,
      output: solutionMassForMolarityExample.output,
    });
  });

  it("computes sixty grams for a two molar liter-and-a-half", () => {
    expect(
      runSolutionMassForMolarity({
        targetMolarity: 2,
        volumeLiters: 1.5,
        molarMass: 20,
      }),
    ).toEqual({
      ok: true,
      output: { soluteMassGrams: 60 },
    });
  });

  it("computes forty grams for a quarter molar four liters", () => {
    expect(
      runSolutionMassForMolarity({
        targetMolarity: 0.25,
        volumeLiters: 4,
        molarMass: 40,
      }),
    ).toEqual({
      ok: true,
      output: { soluteMassGrams: 40 },
    });
  });

  it("rejects a zero target molarity", () => {
    expect(
      runSolutionMassForMolarity({
        targetMolarity: 0,
        volumeLiters: 1,
        molarMass: 40,
      }).ok,
    ).toBe(false);
  });

  it("rejects a negative volume", () => {
    expect(
      runSolutionMassForMolarity({
        targetMolarity: 1,
        volumeLiters: -1,
        molarMass: 40,
      }).ok,
    ).toBe(false);
  });

  it("rejects a zero molar mass", () => {
    expect(
      runSolutionMassForMolarity({
        targetMolarity: 1,
        volumeLiters: 1,
        molarMass: 0,
      }).ok,
    ).toBe(false);
  });

  it("requires all three inputs", () => {
    expect(
      runSolutionMassForMolarity({ targetMolarity: 1, volumeLiters: 1 }).ok,
    ).toBe(false);
    expect(runSolutionMassForMolarity({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runSolutionMassForMolarity(40).ok).toBe(false);
  });
});
