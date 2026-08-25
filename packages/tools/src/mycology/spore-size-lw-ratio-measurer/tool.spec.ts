import { describe, expect, it } from "vitest";
import {
  runSporeSizeLwRatioMeasurer,
  sporeSizeLwRatioMeasurerExample,
} from "./tool.js";

describe("Spore L/W Ratio", () => {
  it("matches the canonical example", () => {
    expect(
      runSporeSizeLwRatioMeasurer(sporeSizeLwRatioMeasurerExample.input),
    ).toEqual({
      ok: true,
      output: sporeSizeLwRatioMeasurerExample.output,
    });
  });
  it("divides length by width", () =>
    expect(runSporeSizeLwRatioMeasurer({ lengthUm: 10, widthUm: 5 })).toEqual({
      ok: true,
      output: { lengthWidthRatio: 2 },
    }));
  it("handles fractional ratios", () =>
    expect(runSporeSizeLwRatioMeasurer({ lengthUm: 8, widthUm: 5 })).toEqual({
      ok: true,
      output: { lengthWidthRatio: 1.6 },
    }));
  it("globose spores give a ratio near one", () =>
    expect(runSporeSizeLwRatioMeasurer({ lengthUm: 7, widthUm: 7 })).toEqual({
      ok: true,
      output: { lengthWidthRatio: 1 },
    }));
  it("elongated spores give large ratios", () =>
    expect(runSporeSizeLwRatioMeasurer({ lengthUm: 15, widthUm: 3 })).toEqual({
      ok: true,
      output: { lengthWidthRatio: 5 },
    }));
  it("rejects zero length", () =>
    expect(runSporeSizeLwRatioMeasurer({ lengthUm: 0, widthUm: 4 }).ok).toBe(
      false,
    ));
  it("rejects zero width", () =>
    expect(runSporeSizeLwRatioMeasurer({ lengthUm: 9, widthUm: 0 }).ok).toBe(
      false,
    ));
  it("rejects negative measurements", () =>
    expect(runSporeSizeLwRatioMeasurer({ lengthUm: -8, widthUm: 2 }).ok).toBe(
      false,
    ));
});
