import { describe, expect, it } from "vitest";
import { runPrimerHairpinTm } from "./tool.js";

describe("Hairpin Tm Estimate", () => {
  it("calculates a valid result", () =>
    expect(runPrimerHairpinTm({ sequence: "ACGTTTTACGT" })).toEqual({
      ok: true,
      output: { hairpinTempC: 12, stemLength: 4 },
    }));
  it("scores GC-rich stems with four degrees per pair", () => {
    const result = runPrimerHairpinTm({ sequence: "GGCCACCGGCCAAT" });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.hairpinTempC).toBeGreaterThanOrEqual(12);
  });
  it("finds stems capped at eight bases", () => {
    const result = runPrimerHairpinTm({
      sequence: "GAATTCGAATTCGAATTCGAATTCGAATTCGAATTC",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.stemLength).toBeLessThanOrEqual(8);
  });
  it("reports zero for homopolymers", () =>
    expect(runPrimerHairpinTm({ sequence: "AAAAAAAA" })).toEqual({
      ok: true,
      output: { hairpinTempC: 0, stemLength: 0 },
    }));
  it("requires stems of at least three bases around a loop", () =>
    expect(runPrimerHairpinTm({ sequence: "AAAGGGTTT" })).toEqual({
      ok: true,
      output: { hairpinTempC: 6, stemLength: 3 },
    }));
  it("requires a loop between paired arms", () =>
    expect(runPrimerHairpinTm({ sequence: "TTGAATTC" })).toEqual({
      ok: true,
      output: { hairpinTempC: 0, stemLength: 0 },
    }));
  it("rejects empty sequences", () => {
    const result = runPrimerHairpinTm({ sequence: "" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("empty_sequence");
  });
  it("rejects invalid bases", () => {
    const result = runPrimerHairpinTm({ sequence: "gaattc" });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_sequence");
  });
});
