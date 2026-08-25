import { describe, expect, it } from "vitest";
import { runCodonFrequency } from "./tool.js";

describe("Codon Frequency", () => {
  it("calculates a valid result", () =>
    expect(runCodonFrequency({ codon: "ATG", sequence: "ATGGCA" })).toEqual({
      ok: true,
      output: { codonFrequency: 0.5 },
    }));
  it("reads the first frame only", () =>
    expect(runCodonFrequency({ codon: "AAA", sequence: "AAACCC" })).toEqual({
      ok: true,
      output: { codonFrequency: 0.5 },
    }));
  it("returns one for a uniform sequence", () =>
    expect(runCodonFrequency({ codon: "AAA", sequence: "AAAAAA" })).toEqual({
      ok: true,
      output: { codonFrequency: 1 },
    }));
  it("returns zero for an absent codon", () =>
    expect(runCodonFrequency({ codon: "CCC", sequence: "ATGGCA" })).toEqual({
      ok: true,
      output: { codonFrequency: 0 },
    }));
  it("counts a single-codon sequence", () =>
    expect(runCodonFrequency({ codon: "ATG", sequence: "ATG" })).toEqual({
      ok: true,
      output: { codonFrequency: 1 },
    }));
  it("rejects a sequence with no complete codon", () => {
    const result = runCodonFrequency({ codon: "ATG", sequence: "AT" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("zero_codons");
  });
  it("rejects a short codon", () => {
    const result = runCodonFrequency({ codon: "AA", sequence: "AAAA" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
  it("rejects non-DNA codons", () =>
    expect(runCodonFrequency({ codon: "ATX", sequence: "ATGGCA" }).ok).toBe(
      false,
    ));
});
