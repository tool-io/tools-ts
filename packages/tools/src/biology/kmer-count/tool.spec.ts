import { describe, expect, it } from "vitest";
import { runKmerCount } from "./tool.js";

describe("K-mer Count", () => {
  it("calculates a valid result", () =>
    expect(runKmerCount({ kmer: "AA", sequence: "AAAA" })).toEqual({
      ok: true,
      output: { kmerCount: 3 },
    }));
  it("counts a unique match", () =>
    expect(runKmerCount({ kmer: "GAT", sequence: "GATATC" })).toEqual({
      ok: true,
      output: { kmerCount: 1 },
    }));
  it("returns zero without matches", () =>
    expect(runKmerCount({ kmer: "AA", sequence: "GGCC" })).toEqual({
      ok: true,
      output: { kmerCount: 0 },
    }));
  it("counts a whole-sequence match", () =>
    expect(runKmerCount({ kmer: "ATG", sequence: "ATG" })).toEqual({
      ok: true,
      output: { kmerCount: 1 },
    }));
  it("counts overlapping windows", () =>
    expect(runKmerCount({ kmer: "ATA", sequence: "ATATA" })).toEqual({
      ok: true,
      output: { kmerCount: 2 },
    }));
  it("rejects k-mers longer than the sequence", () => {
    const result = runKmerCount({ kmer: "ATGCA", sequence: "ATGC" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_length");
  });
  it("rejects an empty sequence", () =>
    expect(runKmerCount({ kmer: "AA", sequence: "" }).ok).toBe(false));
  it("rejects lowercase k-mers", () => {
    const result = runKmerCount({ kmer: "aa", sequence: "AAAA" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
