import { describe, expect, it } from "vitest";
import { runMeltingTempGc } from "./tool.js";

describe("GC Rule Tm", () => {
  it("calculates a valid result", () =>
    expect(runMeltingTempGc({ sequence: "ACGTACGTACGTACGT" })).toEqual({
      ok: true,
      output: { meltingTempC: 43.375000000000014 },
    }));
  it("accepts fourteen bases", () =>
    expect(runMeltingTempGc({ sequence: "AAAAAAAAAAAAAA" })).toEqual({
      ok: true,
      output: { meltingTempC: 16.87142857142858 },
    }));
  it("raises temperature with GC content", () =>
    expect(runMeltingTempGc({ sequence: "ACGTACGTACGTACGTACGT" })).toEqual({
      ok: true,
      output: { meltingTempC: 51.78000000000001 },
    }));
  it("rejects thirteen bases", () => {
    const result = runMeltingTempGc({ sequence: "ACGTACGTACGTA" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_length");
  });
  it("rejects an empty sequence", () =>
    expect(runMeltingTempGc({ sequence: "" }).ok).toBe(false));
  it("rejects lowercase bases", () =>
    expect(runMeltingTempGc({ sequence: "acgtacgtacgtac" }).ok).toBe(false));
  it("rejects ambiguous bases", () =>
    expect(runMeltingTempGc({ sequence: "NACGTACGTACGTA" }).ok).toBe(false));
});
