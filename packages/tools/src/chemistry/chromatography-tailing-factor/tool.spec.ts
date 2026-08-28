import { describe, expect, it } from "vitest";
import {
  chromatographyTailingFactorExample,
  runChromatographyTailingFactor,
} from "./tool.js";
describe("USP Tailing Factor", () => {
  it("publishes an executable example", () =>
    expect(
      runChromatographyTailingFactor(chromatographyTailingFactorExample.input),
    ).toEqual({
      ok: true,
      output: chromatographyTailingFactorExample.output,
    }));
  it("returns unity for a USP ideal symmetric peak", () =>
    expect(
      runChromatographyTailingFactor({
        totalWidthAt5PercentMin: 2,
        frontHalfWidthMin: 1,
      }),
    ).toEqual({ ok: true, output: { tailingFactor: 1 } }));
  it("exceeds unity for tailed peaks", () =>
    expect(
      runChromatographyTailingFactor({
        totalWidthAt5PercentMin: 3,
        frontHalfWidthMin: 1,
      }),
    ).toEqual({ ok: true, output: { tailingFactor: 1.5 } }));
  it("matches a fractional case closely", () => {
    const result = runChromatographyTailingFactor({
      totalWidthAt5PercentMin: 1.35,
      frontHalfWidthMin: 0.45,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.tailingFactor).toBeCloseTo(1.5, 12);
  });
  it("rejects zero total width", () =>
    expect(
      runChromatographyTailingFactor({
        totalWidthAt5PercentMin: 0,
        frontHalfWidthMin: 1,
      }).ok,
    ).toBe(false));
  it("rejects zero front half width", () =>
    expect(
      runChromatographyTailingFactor({
        totalWidthAt5PercentMin: 2,
        frontHalfWidthMin: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative widths", () =>
    expect(
      runChromatographyTailingFactor({
        totalWidthAt5PercentMin: -2,
        frontHalfWidthMin: 1,
      }).ok,
    ).toBe(false));
});
