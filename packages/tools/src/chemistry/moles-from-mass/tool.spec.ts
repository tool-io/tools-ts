import { describe, expect, it } from "vitest";
import { runMolesFromMass, molesFromMassExample } from "./tool.js";

describe("Moles From Mass", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runMolesFromMass(molesFromMassExample.input)).toEqual({
      ok: true,
      output: molesFromMassExample.output,
    });
  });

  it("computes two moles from water-like values", () => {
    expect(runMolesFromMass({ massGrams: 36, molarMassGPerMol: 18 })).toEqual({
      ok: true,
      output: { moles: 2 },
    });
  });

  it("computes fractional moles", () => {
    expect(runMolesFromMass({ massGrams: 9, molarMassGPerMol: 2 })).toEqual({
      ok: true,
      output: { moles: 4.5 },
    });
  });

  it("returns zero moles for zero mass", () =>
    expect(runMolesFromMass({ massGrams: 0, molarMassGPerMol: 18 })).toEqual({
      ok: true,
      output: { moles: 0 },
    }));

  it("rejects a negative mass", () => {
    expect(runMolesFromMass({ massGrams: -5, molarMassGPerMol: 18 }).ok).toBe(
      false,
    );
  });

  it("rejects a zero molar mass", () => {
    expect(runMolesFromMass({ massGrams: 10, molarMassGPerMol: 0 }).ok).toBe(
      false,
    );
  });

  it("requires both inputs", () => {
    expect(runMolesFromMass({ massGrams: 10 }).ok).toBe(false);
    expect(runMolesFromMass({}).ok).toBe(false);
  });

  it("rejects non-object input", () => {
    expect(runMolesFromMass("10").ok).toBe(false);
  });
});
