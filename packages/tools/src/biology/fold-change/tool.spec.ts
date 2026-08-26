import { describe, expect, it } from "vitest";
import { runFoldChange } from "./tool.js";

describe("Fold Change", () => {
  it("calculates a valid result", () =>
    expect(runFoldChange({ conditionMean: 16, controlMean: 2 })).toEqual({
      ok: true,
      output: { foldChange: 8, log2FoldChange: 3 },
    }));
  it("captures downregulation with negative log2", () =>
    expect(runFoldChange({ conditionMean: 1, controlMean: 4 })).toEqual({
      ok: true,
      output: { foldChange: 0.25, log2FoldChange: -2 },
    }));
  it("reports unchanged expression as zero log2", () =>
    expect(runFoldChange({ conditionMean: 5, controlMean: 5 })).toEqual({
      ok: true,
      output: { foldChange: 1, log2FoldChange: 0 },
    }));
  it("rejects negative condition means", () =>
    expect(runFoldChange({ conditionMean: -6, controlMean: 3 }).ok).toBe(
      false,
    ));
  it("resolves fractional changes", () =>
    expect(runFoldChange({ conditionMean: 5, controlMean: 4 })).toEqual({
      ok: true,
      output: { foldChange: 1.25, log2FoldChange: 0.32192809488736235 },
    }));
  it("handles eighth-fold reductions exactly", () =>
    expect(runFoldChange({ conditionMean: 3, controlMean: 24 })).toEqual({
      ok: true,
      output: { foldChange: 0.125, log2FoldChange: -3 },
    }));
  it("rejects a zero control mean", () => {
    const result = runFoldChange({ conditionMean: 8, controlMean: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_control");
  });
});
