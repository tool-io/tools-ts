import { describe, expect, it } from "vitest";
import { runTitrationPhStrongAcidBase } from "./tool.js";

describe("Titration pH Strong Acid Base Calculator", () => {
  it("returns neutral at the equivalence point", () => {
    expect(
      runTitrationPhStrongAcidBase({
        acidMoles: 0.01,
        baseMoles: 0.01,
        totalVolumeL: 1,
      }),
    ).toEqual({ ok: true, output: { ph: 7 } });
  });

  it("computes excess acid pH", () => {
    const result = runTitrationPhStrongAcidBase({
      acidMoles: 0.02,
      baseMoles: 0.01,
      totalVolumeL: 1,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ph).toBeCloseTo(2, 9);
  });

  it("rejects invalid input", () =>
    expect(runTitrationPhStrongAcidBase(null).ok).toBe(false));
});
