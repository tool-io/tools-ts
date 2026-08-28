import { describe, expect, it } from "vitest";
import {
  chromatographyPeakAsymmetryExample,
  runChromatographyPeakAsymmetry,
} from "./tool.js";
describe("Peak Asymmetry Factor", () => {
  it("publishes an executable example", () =>
    expect(
      runChromatographyPeakAsymmetry(chromatographyPeakAsymmetryExample.input),
    ).toEqual({
      ok: true,
      output: chromatographyPeakAsymmetryExample.output,
    }));
  it("returns unity for symmetric peaks", () =>
    expect(
      runChromatographyPeakAsymmetry({
        tailHalfWidthMin: 0.8,
        frontHalfWidthMin: 0.8,
      }),
    ).toEqual({ ok: true, output: { asymmetryFactor: 1 } }));
  it("drops below one for fronting peaks", () =>
    expect(
      runChromatographyPeakAsymmetry({
        tailHalfWidthMin: 0.6,
        frontHalfWidthMin: 1.2,
      }),
    ).toEqual({ ok: true, output: { asymmetryFactor: 0.5 } }));
  it("matches a tailed peak case closely", () => {
    const result = runChromatographyPeakAsymmetry({
      tailHalfWidthMin: 0.75,
      frontHalfWidthMin: 0.5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.asymmetryFactor).toBeCloseTo(1.5, 12);
  });
  it("rejects zero tail half width", () =>
    expect(
      runChromatographyPeakAsymmetry({
        tailHalfWidthMin: 0,
        frontHalfWidthMin: 1,
      }).ok,
    ).toBe(false));
  it("rejects zero front half width", () =>
    expect(
      runChromatographyPeakAsymmetry({
        tailHalfWidthMin: 1,
        frontHalfWidthMin: 0,
      }).ok,
    ).toBe(false));
  it("rejects negative widths", () =>
    expect(
      runChromatographyPeakAsymmetry({
        tailHalfWidthMin: -1,
        frontHalfWidthMin: 0.5,
      }).ok,
    ).toBe(false));
});
