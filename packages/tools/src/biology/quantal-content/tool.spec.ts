import { describe, expect, it } from "vitest";
import { runQuantalContent } from "./tool.js";

describe("Quantal Content m", () => {
  it("calculates a valid result", () =>
    expect(
      runQuantalContent({
        meanEndplatePotentialMv: 5,
        miniaturePotentialMv: 0.5,
      }),
    ).toEqual({
      ok: true,
      output: { quantalContent: 10 },
    }));
  it("yields one when both potentials match", () => {
    const result = runQuantalContent({
      meanEndplatePotentialMv: 1.2,
      miniaturePotentialMv: 1.2,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.quantalContent).toBe(1);
  });
  it("scales with the mean endplate potential", () => {
    const result = runQuantalContent({
      meanEndplatePotentialMv: 8,
      miniaturePotentialMv: 0.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.quantalContent).toBe(16);
  });
  it("supports fractional quantal content", () => {
    const result = runQuantalContent({
      meanEndplatePotentialMv: 0.4,
      miniaturePotentialMv: 0.8,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.quantalContent).toBeCloseTo(0.5, 12);
  });
  it("rejects zero mean endplate potential", () => {
    const result = runQuantalContent({
      meanEndplatePotentialMv: 0,
      miniaturePotentialMv: 0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_mean");
  });
  it("rejects negative miniature potential", () => {
    const result = runQuantalContent({
      meanEndplatePotentialMv: 5,
      miniaturePotentialMv: -0.5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_miniature");
  });
  it("rejects non-finite inputs", () =>
    expect(
      runQuantalContent({
        meanEndplatePotentialMv: Number.NaN,
        miniaturePotentialMv: 0.5,
      }).ok,
    ).toBe(false));
});
