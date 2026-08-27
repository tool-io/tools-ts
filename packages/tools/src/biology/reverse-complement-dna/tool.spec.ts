import { describe, expect, it } from "vitest";
import { runReverseComplementDna } from "./tool.js";

describe("Reverse Complement", () => {
  it("calculates a valid result", () =>
    expect(runReverseComplementDna({ sequence: "ATGCAG" })).toEqual({
      ok: true,
      output: { reverseComplement: "CTGCAT" },
    }));
  it("reverses before reading", () =>
    expect(runReverseComplementDna({ sequence: "AAAC" })).toEqual({
      ok: true,
      output: { reverseComplement: "GTTT" },
    }));
  it("handles a single base", () =>
    expect(runReverseComplementDna({ sequence: "A" })).toEqual({
      ok: true,
      output: { reverseComplement: "T" },
    }));
  it("handles two bases", () =>
    expect(runReverseComplementDna({ sequence: "AT" })).toEqual({
      ok: true,
      output: { reverseComplement: "AT" },
    }));
  it("is an involution", () => {
    const once = runReverseComplementDna({ sequence: "ATGCAG" });
    expect(once.ok).toBe(true);
    if (once.ok)
      expect(
        runReverseComplementDna({
          sequence: once.output.reverseComplement,
        }),
      ).toEqual({ ok: true, output: { reverseComplement: "ATGCAG" } });
  });
  it("rejects an empty sequence", () =>
    expect(runReverseComplementDna({ sequence: "" }).ok).toBe(false));
  it("rejects non-DNA characters", () => {
    const result = runReverseComplementDna({ sequence: "ATGN" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
