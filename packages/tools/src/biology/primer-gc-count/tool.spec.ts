import { describe, expect, it } from "vitest";
import { runPrimerGcCount } from "./tool.js";

describe("Primer GC Percent", () => {
  it("calculates a valid result", () =>
    expect(runPrimerGcCount({ sequence: "GCGCCAAA" })).toEqual({
      ok: true,
      output: { gcPercent: 62.5 },
    }));
  it("returns 100 percent for an all-GC primer", () =>
    expect(runPrimerGcCount({ sequence: "GCGC" })).toEqual({
      ok: true,
      output: { gcPercent: 100 },
    }));
  it("returns 0 percent for an AT-only primer", () =>
    expect(runPrimerGcCount({ sequence: "AAAT" })).toEqual({
      ok: true,
      output: { gcPercent: 0 },
    }));
  it("handles a single base", () =>
    expect(runPrimerGcCount({ sequence: "C" })).toEqual({
      ok: true,
      output: { gcPercent: 100 },
    }));
  it("rejects an empty primer", () => {
    const result = runPrimerGcCount({ sequence: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("empty_sequence");
  });
  it("rejects lowercase bases", () => {
    const result = runPrimerGcCount({ sequence: "gcgc" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
  it("rejects ambiguous bases", () =>
    expect(runPrimerGcCount({ sequence: "GCNC" }).ok).toBe(false));
});
