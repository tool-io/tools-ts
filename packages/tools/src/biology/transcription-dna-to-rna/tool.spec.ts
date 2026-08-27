import { describe, expect, it } from "vitest";
import { runTranscriptionDnaToRna } from "./tool.js";

describe("Transcribe To RNA", () => {
  it("calculates a valid result", () =>
    expect(runTranscriptionDnaToRna({ sequence: "ATGCAG" })).toEqual({
      ok: true,
      output: { rna: "AUGCAG" },
    }));
  it("replaces every thymine", () =>
    expect(runTranscriptionDnaToRna({ sequence: "TTT" })).toEqual({
      ok: true,
      output: { rna: "UUU" },
    }));
  it("keeps other bases", () =>
    expect(runTranscriptionDnaToRna({ sequence: "GCGC" })).toEqual({
      ok: true,
      output: { rna: "GCGC" },
    }));
  it("transcribes the full alphabet", () =>
    expect(runTranscriptionDnaToRna({ sequence: "ACGT" })).toEqual({
      ok: true,
      output: { rna: "ACGU" },
    }));
  it("handles a single base", () =>
    expect(runTranscriptionDnaToRna({ sequence: "T" })).toEqual({
      ok: true,
      output: { rna: "U" },
    }));
  it("rejects an empty sequence", () =>
    expect(runTranscriptionDnaToRna({ sequence: "" }).ok).toBe(false));
  it("rejects lowercase bases", () => {
    const result = runTranscriptionDnaToRna({ sequence: "atgc" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
