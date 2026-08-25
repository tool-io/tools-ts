import { describe, expect, it } from "vitest";
import { runComplementDna } from "./tool.js";

describe("DNA Complement", () => {
  it("calculates a valid result", () =>
    expect(runComplementDna({ sequence: "ATGCAG" })).toEqual({
      ok: true,
      output: { complement: "TACGTC" },
    }));
  it("maps every base", () =>
    expect(runComplementDna({ sequence: "ACGTACGT" })).toEqual({
      ok: true,
      output: { complement: "TGCATGCA" },
    }));
  it("maps homopolymer runs", () =>
    expect(runComplementDna({ sequence: "AAA" })).toEqual({
      ok: true,
      output: { complement: "TTT" },
    }));
  it("handles a single base", () =>
    expect(runComplementDna({ sequence: "C" })).toEqual({
      ok: true,
      output: { complement: "G" },
    }));
  it("rejects an empty sequence", () => {
    const result = runComplementDna({ sequence: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("empty_sequence");
  });
  it("rejects ambiguous bases", () => {
    const result = runComplementDna({ sequence: "ATGX" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
  it("rejects lowercase bases", () =>
    expect(runComplementDna({ sequence: "atgc" }).ok).toBe(false));
});
