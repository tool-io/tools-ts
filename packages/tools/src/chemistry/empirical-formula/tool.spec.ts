import { describe, expect, it } from "vitest";
import { empiricalFormulaExample, runEmpiricalFormula } from "./tool.js";

describe("Empirical Ratio Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEmpiricalFormula(empiricalFormulaExample.input)).toEqual({
      ok: true,
      output: empiricalFormulaExample.output,
    });
  });

  it("normalizes whichever element is larger", () => {
    expect(runEmpiricalFormula({ molesElementA: 4, molesElementB: 2 })).toEqual(
      {
        ok: true,
        output: { empiricalRatioA: 2, empiricalRatioB: 1 },
      },
    );
  });

  it("returns ones for equal mole amounts", () => {
    expect(runEmpiricalFormula({ molesElementA: 3, molesElementB: 3 })).toEqual(
      {
        ok: true,
        output: { empiricalRatioA: 1, empiricalRatioB: 1 },
      },
    );
  });

  it("rounds repeating ratios to three decimals", () => {
    expect(runEmpiricalFormula({ molesElementA: 3, molesElementB: 4 })).toEqual(
      {
        ok: true,
        output: { empiricalRatioA: 1, empiricalRatioB: 1.333 },
      },
    );
  });

  it("reduces a three-to-one composition", () => {
    expect(runEmpiricalFormula({ molesElementA: 2, molesElementB: 6 })).toEqual(
      {
        ok: true,
        output: { empiricalRatioA: 1, empiricalRatioB: 3 },
      },
    );
  });

  it("rejects a zero element amount", () => {
    expect(runEmpiricalFormula({ molesElementA: 0, molesElementB: 2 }).ok).toBe(
      false,
    );
    expect(runEmpiricalFormula({ molesElementA: 2, molesElementB: 0 }).ok).toBe(
      false,
    );
  });

  it("rejects a negative element amount", () => {
    expect(
      runEmpiricalFormula({ molesElementA: -1, molesElementB: 2 }).ok,
    ).toBe(false);
  });

  it("requires both inputs", () => {
    expect(runEmpiricalFormula({ molesElementA: 1 }).ok).toBe(false);
    expect(runEmpiricalFormula({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runEmpiricalFormula("H2O").ok).toBe(false);
  });
});
