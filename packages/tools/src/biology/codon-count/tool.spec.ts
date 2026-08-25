import { describe, expect, it } from "vitest";
import { runCodonCount } from "./tool.js";

describe("Codon Count", () => {
  it("calculates a valid result", () =>
    expect(runCodonCount({ sequence: "ATGCAGTAA" })).toEqual({
      ok: true,
      output: { codonCount: 3 },
    }));
  it("counts complete codons only", () =>
    expect(runCodonCount({ sequence: "ATGCAGTA" })).toEqual({
      ok: true,
      output: { codonCount: 2 },
    }));
  it("counts a single codon", () =>
    expect(runCodonCount({ sequence: "ATG" })).toEqual({
      ok: true,
      output: { codonCount: 1 },
    }));
  it("returns zero for leftover bases", () =>
    expect(runCodonCount({ sequence: "AT" })).toEqual({
      ok: true,
      output: { codonCount: 0 },
    }));
  it("allows an empty sequence", () =>
    expect(runCodonCount({ sequence: "" })).toEqual({
      ok: true,
      output: { codonCount: 0 },
    }));
  it("counts long sequences in threes", () =>
    expect(runCodonCount({ sequence: "ACGTACGTACGTACGTACGTACGTACG" })).toEqual({
      ok: true,
      output: { codonCount: 9 },
    }));
  it("rejects non-DNA characters", () => {
    const result = runCodonCount({ sequence: "ATX" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
