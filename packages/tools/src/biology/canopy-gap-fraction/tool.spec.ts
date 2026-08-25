import { describe, expect, it } from "vitest";
import { canopyGapFractionExample, runCanopyGapFraction } from "./tool.js";

describe("Gap Fraction %", () => {
  it("publishes an executable example", () =>
    expect(runCanopyGapFraction(canopyGapFractionExample.input)).toEqual({
      ok: true,
      output: canopyGapFractionExample.output,
    }));
  it("is zero for a closed canopy", () =>
    expect(runCanopyGapFraction({ gapPixels: 0, totalPixels: 8000 })).toEqual({
      ok: true,
      output: { gapFractionPercent: 0 },
    }));
  it("is one hundred for a fully open canopy", () =>
    expect(
      runCanopyGapFraction({ gapPixels: 8000, totalPixels: 8000 }),
    ).toEqual({ ok: true, output: { gapFractionPercent: 100 } }));
  it("calculates sparse gaps", () =>
    expect(
      runCanopyGapFraction({ gapPixels: 2500, totalPixels: 20000 }),
    ).toEqual({ ok: true, output: { gapFractionPercent: 12.5 } }));
  it("rejects gaps exceeding total pixels", () => {
    const result = runCanopyGapFraction({
      gapPixels: 11,
      totalPixels: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_counts");
  });
  it("rejects a zero total pixel count", () =>
    expect(runCanopyGapFraction({ gapPixels: 0, totalPixels: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative gaps", () =>
    expect(runCanopyGapFraction({ gapPixels: -1, totalPixels: 10 }).ok).toBe(
      false,
    ));
  it("rejects fractional pixel counts", () =>
    expect(runCanopyGapFraction({ gapPixels: 1.5, totalPixels: 10 }).ok).toBe(
      false,
    ));
});
