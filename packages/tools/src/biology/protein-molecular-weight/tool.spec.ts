import { describe, expect, it } from "vitest";
import { runProteinMolecularWeight } from "./tool.js";

describe("Protein MW From Length", () => {
  it("estimates a mid size protein", () =>
    expect(runProteinMolecularWeight({ aminoAcids: 300 })).toEqual({
      ok: true,
      output: { molecularWeightDa: 33000 },
    }));
  it("estimates insulin length", () =>
    expect(runProteinMolecularWeight({ aminoAcids: 51 })).toEqual({
      ok: true,
      output: { molecularWeightDa: 5610 },
    }));
  it("handles the minimum residue count", () =>
    expect(runProteinMolecularWeight({ aminoAcids: 1 })).toEqual({
      ok: true,
      output: { molecularWeightDa: 110 },
    }));
  it("handles large polypeptides", () =>
    expect(runProteinMolecularWeight({ aminoAcids: 10000 })).toEqual({
      ok: true,
      output: { molecularWeightDa: 1100000 },
    }));
  it("rejects zero residues", () => {
    const result = runProteinMolecularWeight({ aminoAcids: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_length");
  });
  it("rejects negative residue counts", () => {
    const result = runProteinMolecularWeight({ aminoAcids: -20 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_length");
  });
});
