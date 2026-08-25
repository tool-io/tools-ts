import { describe, expect, it } from "vitest";
import { runAtContent } from "./tool.js";

describe("AT Content Calculator", () => {
  it("calculates a valid result", () =>
    expect(runAtContent({ sequence: "GATTACA" })).toEqual({
      ok: true,
      output: { atPercent: 71.42857142857143 },
    }));
  it("returns 100 percent for an all-AT sequence", () =>
    expect(runAtContent({ sequence: "ATAT" })).toEqual({
      ok: true,
      output: { atPercent: 100 },
    }));
  it("returns 0 percent for an all-GC sequence", () =>
    expect(runAtContent({ sequence: "GCGC" })).toEqual({
      ok: true,
      output: { atPercent: 0 },
    }));
  it("handles a single base", () =>
    expect(runAtContent({ sequence: "T" })).toEqual({
      ok: true,
      output: { atPercent: 100 },
    }));
  it("counts mixed runs", () =>
    expect(runAtContent({ sequence: "GGCCAAAA" })).toEqual({
      ok: true,
      output: { atPercent: 50 },
    }));
  it("rejects an empty sequence", () => {
    const result = runAtContent({ sequence: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("empty_sequence");
  });
  it("rejects non-DNA characters", () =>
    expect(runAtContent({ sequence: "AU" }).ok).toBe(false));
});
