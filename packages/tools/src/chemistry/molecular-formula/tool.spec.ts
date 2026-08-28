import { describe, expect, it } from "vitest";
import { molecularFormulaExample, runMolecularFormula } from "./tool.js";

describe("Molecular Multiplier Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMolecularFormula(molecularFormulaExample.input)).toEqual({
      ok: true,
      output: molecularFormulaExample.output,
    });
  });

  it("rejects a mass ratio far from a whole number", () =>
    expect(
      runMolecularFormula({ molecularWeight: 150, empiricalWeight: 45 }).ok,
    ).toBe(false));

  it("rounds to the nearest integer", () => {
    expect(
      runMolecularFormula({ molecularWeight: 140, empiricalWeight: 48 }),
    ).toEqual({
      ok: true,
      output: { formulaMultiplier: 3 },
    });
  });

  it("returns one for identical weights", () => {
    expect(
      runMolecularFormula({ molecularWeight: 60, empiricalWeight: 60 }),
    ).toEqual({
      ok: true,
      output: { formulaMultiplier: 1 },
    });
  });

  it("rejects a zero empirical weight", () => {
    expect(
      runMolecularFormula({ molecularWeight: 180, empiricalWeight: 0 }).ok,
    ).toBe(false);
  });

  it("rejects a negative molecular weight", () => {
    expect(
      runMolecularFormula({ molecularWeight: -180, empiricalWeight: 30 }).ok,
    ).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runMolecularFormula({ molecularWeight: 180 }).ok).toBe(false);
    expect(runMolecularFormula({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runMolecularFormula(6).ok).toBe(false);
  });
});
