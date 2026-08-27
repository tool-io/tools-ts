import { describe, expect, it } from "vitest";
import { runPrimer3primeGcClampCount } from "./tool.js";

describe("3' GC Clamp Count", () => {
  it("counts three terminal GC bases", () =>
    expect(runPrimer3primeGcClampCount({ sequence: "ATGGCCG" })).toEqual({
      ok: true,
      output: { clampCount: 3 },
    }));
  it("counts zero for an AT only tail", () =>
    expect(runPrimer3primeGcClampCount({ sequence: "AAAAAA" })).toEqual({
      ok: true,
      output: { clampCount: 0 },
    }));
  it("uses only the last three nucleotides", () => {
    expect(runPrimer3primeGcClampCount({ sequence: "GGGTTT" })).toEqual({
      ok: true,
      output: { clampCount: 0 },
    });
    expect(runPrimer3primeGcClampCount({ sequence: "TTTGGG" })).toEqual({
      ok: true,
      output: { clampCount: 3 },
    });
  });
  it("accepts the minimum length of three", () =>
    expect(runPrimer3primeGcClampCount({ sequence: "CGT" })).toEqual({
      ok: true,
      output: { clampCount: 2 },
    }));
  it("counts a single clamp base", () =>
    expect(runPrimer3primeGcClampCount({ sequence: "ATGCAA" })).toEqual({
      ok: true,
      output: { clampCount: 1 },
    }));
  it("rejects non DNA characters", () => {
    const result = runPrimer3primeGcClampCount({ sequence: "ACGU" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
  it("rejects sequences shorter than three", () => {
    const result = runPrimer3primeGcClampCount({ sequence: "GC" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("sequence_too_short");
  });
});
