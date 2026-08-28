import { describe, expect, it } from "vitest";
import {
  chromatographySelectivityExample,
  runChromatographySelectivity,
} from "./tool.js";
describe("Selectivity Alpha", () => {
  it("publishes an executable example", () =>
    expect(
      runChromatographySelectivity(chromatographySelectivityExample.input),
    ).toEqual({
      ok: true,
      output: chromatographySelectivityExample.output,
    }));
  it("returns unity for co-eluting retention factors", () =>
    expect(runChromatographySelectivity({ kPrimeA: 3, kPrimeB: 3 })).toEqual({
      ok: true,
      output: { selectivityAlpha: 1 },
    }));
  it("inverts when peaks swap order", () =>
    expect(runChromatographySelectivity({ kPrimeA: 4, kPrimeB: 2 })).toEqual({
      ok: true,
      output: { selectivityAlpha: 0.5 },
    }));
  it("matches a fractional selectivity closely", () => {
    const result = runChromatographySelectivity({
      kPrimeA: 1.5,
      kPrimeB: 2.25,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.selectivityAlpha).toBeCloseTo(1.5, 12);
  });
  it("rejects zero retention factor for A", () =>
    expect(runChromatographySelectivity({ kPrimeA: 0, kPrimeB: 2 }).ok).toBe(
      false,
    ));
  it("rejects negative retention factor for B", () =>
    expect(runChromatographySelectivity({ kPrimeA: 2, kPrimeB: -4 }).ok).toBe(
      false,
    ));
  it("rejects non-finite retention factors", () =>
    expect(
      runChromatographySelectivity({ kPrimeA: Number.NaN, kPrimeB: 2 }).ok,
    ).toBe(false));
});
