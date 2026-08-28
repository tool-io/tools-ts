import { describe, expect, it } from "vitest";
import {
  chromatographyResolutionExample,
  runChromatographyResolution,
} from "./tool.js";
describe("Chromatographic Resolution", () => {
  it("publishes an executable example", () =>
    expect(
      runChromatographyResolution(chromatographyResolutionExample.input),
    ).toEqual({
      ok: true,
      output: chromatographyResolutionExample.output,
    }));
  it("doubles resolution with doubled separation", () =>
    expect(
      runChromatographyResolution({ rt1: 5, rt2: 9, w1: 1, w2: 1 }),
    ).toEqual({ ok: true, output: { resolution: 4 } }));
  it("halves resolution when both widths double", () =>
    expect(
      runChromatographyResolution({ rt1: 5, rt2: 7, w1: 2, w2: 2 }),
    ).toEqual({ ok: true, output: { resolution: 1 } }));
  it("handles unequal widths closely", () => {
    const result = runChromatographyResolution({
      rt1: 4.25,
      rt2: 5.75,
      w1: 0.8,
      w2: 1.2,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.resolution).toBeCloseTo(1.5, 12);
  });
  it("rejects equal retention times", () =>
    expect(
      runChromatographyResolution({ rt1: 5, rt2: 5, w1: 1, w2: 1 }).ok,
    ).toBe(false));
  it("rejects inverted retention order", () =>
    expect(
      runChromatographyResolution({ rt1: 7, rt2: 5, w1: 1, w2: 1 }).ok,
    ).toBe(false));
  it("rejects zero first retention time", () =>
    expect(
      runChromatographyResolution({ rt1: 0, rt2: 7, w1: 1, w2: 1 }).ok,
    ).toBe(false));
  it("rejects zero peak width", () =>
    expect(
      runChromatographyResolution({ rt1: 5, rt2: 7, w1: 0, w2: 1 }).ok,
    ).toBe(false));
  it("rejects negative peak width", () =>
    expect(
      runChromatographyResolution({ rt1: 5, rt2: 7, w1: 1, w2: -1 }).ok,
    ).toBe(false));
});
