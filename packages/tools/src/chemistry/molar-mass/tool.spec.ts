import { describe, expect, it } from "vitest";
import { runMolarMass, molarMassExample } from "./tool.js";

describe("Molar Mass From Formula Weight", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMolarMass(molarMassExample.input)).toEqual({
      ok: true,
      output: molarMassExample.output,
    });
  });

  it("passes through an integer formula weight unchanged", () => {
    expect(runMolarMass({ formulaWeight: 58 })).toEqual({
      ok: true,
      output: { molarMassGPerMol: 58 },
    });
  });

  it("passes through a fractional formula weight unchanged", () => {
    expect(runMolarMass({ formulaWeight: 44.01 })).toEqual({
      ok: true,
      output: { molarMassGPerMol: 44.01 },
    });
  });

  it("accepts very small positive weights", () => {
    expect(runMolarMass({ formulaWeight: 0.001 })).toEqual({
      ok: true,
      output: { molarMassGPerMol: 0.001 },
    });
  });

  it("rejects a zero formula weight", () => {
    expect(runMolarMass({ formulaWeight: 0 }).ok).toBe(false);
  });

  it("rejects a negative formula weight", () => {
    expect(runMolarMass({ formulaWeight: -18 }).ok).toBe(false);
  });

  it("requires the formula weight", () => {
    expect(runMolarMass({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runMolarMass(18).ok).toBe(false);
  });
});
