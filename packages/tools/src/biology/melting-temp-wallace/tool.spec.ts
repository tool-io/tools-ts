import { describe, expect, it } from "vitest";
import { runMeltingTempWallace } from "./tool.js";

describe("Wallace Tm", () => {
  it("calculates a valid result", () =>
    expect(runMeltingTempWallace({ sequence: "ATCGCGTA" })).toEqual({
      ok: true,
      output: { meltingTempC: 24 },
    }));
  it("scores AT pairs as two degrees", () =>
    expect(runMeltingTempWallace({ sequence: "AT" })).toEqual({
      ok: true,
      output: { meltingTempC: 4 },
    }));
  it("scores GC pairs as four degrees", () =>
    expect(runMeltingTempWallace({ sequence: "GCGC" })).toEqual({
      ok: true,
      output: { meltingTempC: 16 },
    }));
  it("accepts fourteen bases", () =>
    expect(runMeltingTempWallace({ sequence: "AAAAAAAAAAAAAA" })).toEqual({
      ok: true,
      output: { meltingTempC: 28 },
    }));
  it("rejects fifteen bases", () => {
    const result = runMeltingTempWallace({
      sequence: "AAAAAAAAAAAAAAA",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_length");
  });
  it("rejects an empty sequence", () =>
    expect(runMeltingTempWallace({ sequence: "" }).ok).toBe(false));
  it("rejects non-DNA characters", () => {
    const result = runMeltingTempWallace({ sequence: "ATGU" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0].code).toBe("invalid_sequence");
  });
});
