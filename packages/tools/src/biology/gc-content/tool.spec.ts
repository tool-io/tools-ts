import { describe, expect, it } from "vitest";
import { runGcContent } from "./tool.js";

describe("GC Content Calculator", () => {
  it("calculates a valid result", () =>
    expect(runGcContent({ sequence: "GATTACA" })).toEqual({
      ok: true,
      output: { gcPercent: 28.57142857142857 },
    }));
  it("returns 100 percent for an all-GC sequence", () =>
    expect(runGcContent({ sequence: "GGCC" })).toEqual({
      ok: true,
      output: { gcPercent: 100 },
    }));
  it("returns 0 percent for an all-AT sequence", () =>
    expect(runGcContent({ sequence: "AATA" })).toEqual({
      ok: true,
      output: { gcPercent: 0 },
    }));
  it("handles a single base", () =>
    expect(runGcContent({ sequence: "G" })).toEqual({
      ok: true,
      output: { gcPercent: 100 },
    }));
  it("rejects an empty sequence", () => {
    const result = runGcContent({ sequence: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("empty_sequence");
  });
  it("rejects lowercase bases", () => {
    const result = runGcContent({ sequence: "gattaca" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
  it("rejects ambiguous bases", () =>
    expect(runGcContent({ sequence: "ATGN" }).ok).toBe(false));
});
