import { describe, expect, it } from "vitest";
import { runOd600ToCfu } from "./tool.js";

describe("OD600 To CFU", () => {
  it("calculates with the default conversion factor", () =>
    expect(runOd600ToCfu({ od600: 0.5 })).toEqual({
      ok: true,
      output: { estimatedCfuPerMl: 500000000 },
    }));
  it("reproduces the default with an explicit factor", () => {
    const implicit = runOd600ToCfu({ od600: 0.5 });
    const explicit = runOd600ToCfu({
      conversionFactor: 1000000000,
      od600: 0.5,
    });
    expect(explicit).toEqual(implicit);
  });
  it("honours custom calibration factors", () => {
    const result = runOd600ToCfu({ conversionFactor: 500000000, od600: 0.2 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.estimatedCfuPerMl).toBe(100000000);
  });
  it("maps zero absorbance to zero cells", () => {
    const result = runOd600ToCfu({ od600: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.estimatedCfuPerMl).toBe(0);
  });
  it("scales linearly with absorbance", () => {
    const a = runOd600ToCfu({ od600: 0.1 });
    const b = runOd600ToCfu({ od600: 0.8 });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok)
      expect(
        Number(b.output.estimatedCfuPerMl) / Number(a.output.estimatedCfuPerMl),
      ).toBe(8);
  });
  it("rejects negative absorbance", () =>
    expect(runOd600ToCfu({ od600: -0.1 }).ok).toBe(false));
  it("rejects non-positive conversion factors", () =>
    expect(runOd600ToCfu({ conversionFactor: 0, od600: 0.5 }).ok).toBe(false));
});
