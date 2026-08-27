import { describe, expect, it } from "vitest";
import { runPrimerSelfDimerTm } from "./tool.js";

describe("Self-Dimer Tm Risk", () => {
  it("calculates a valid result", () =>
    expect(runPrimerSelfDimerTm({ sequence: "GCGATTATCGC" })).toEqual({
      ok: true,
      output: { dimerRisk: true, longestSelfComplementRun: 5 },
    }));
  it("reports a full palindromic sequence", () =>
    expect(runPrimerSelfDimerTm({ sequence: "ACGTACGT" })).toEqual({
      ok: true,
      output: { dimerRisk: true, longestSelfComplementRun: 8 },
    }));
  it("reports a short complementary run as safe", () =>
    expect(runPrimerSelfDimerTm({ sequence: "TTACGGCA" })).toEqual({
      ok: true,
      output: { dimerRisk: false, longestSelfComplementRun: 2 },
    }));
  it("reports zero for sequences with no complementarity", () =>
    expect(runPrimerSelfDimerTm({ sequence: "AAAAAAAA" })).toEqual({
      ok: true,
      output: { dimerRisk: false, longestSelfComplementRun: 0 },
    }));
  it("flags exactly five complementary bases", () =>
    expect(runPrimerSelfDimerTm({ sequence: "GCGATAAATCGC" })).toEqual({
      ok: true,
      output: { dimerRisk: true, longestSelfComplementRun: 5 },
    }));
  it("prefers the longest run over shorter matches", () =>
    expect(runPrimerSelfDimerTm({ sequence: "ACGTACGTACGT" })).toEqual({
      ok: true,
      output: { dimerRisk: true, longestSelfComplementRun: 12 },
    }));
  it("rejects empty sequences", () => {
    const result = runPrimerSelfDimerTm({ sequence: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_sequence");
  });
  it("rejects invalid bases", () => {
    const result = runPrimerSelfDimerTm({ sequence: "ACGUNCGA" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_sequence");
  });
  it("rejects sequences shorter than eight nucleotides", () => {
    const result = runPrimerSelfDimerTm({ sequence: "ACGTACG" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("short_sequence");
  });
});
