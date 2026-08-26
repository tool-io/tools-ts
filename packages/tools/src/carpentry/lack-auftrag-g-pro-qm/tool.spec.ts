import { describe, expect, it } from "vitest";
import { paintCoverageExample, runPaintCoverage } from "./tool.js";

describe("Paint Coverage Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runPaintCoverage(paintCoverageExample.input)).toEqual({
      ok: true,
      output: paintCoverageExample.output,
    }));

  it("honors the default coat count and coverage", () =>
    expect(runPaintCoverage({ areaM2: 5.5 })).toEqual({
      ok: true,
      output: { paintGrams: 1320 },
    }));

  it("calculates a single coat at the lower boundary", () =>
    expect(runPaintCoverage({ areaM2: 10, coatCount: 1 })).toEqual({
      ok: true,
      output: { paintGrams: 1200 },
    }));

  it("scales with three coats and heavier coverage", () =>
    expect(
      runPaintCoverage({
        areaM2: 10,
        coatCount: 3,
        gramsPerM2PerCoat: 150,
      }),
    ).toEqual({
      ok: true,
      output: { paintGrams: 4500 },
    }));

  it("handles fractional coverage values", () =>
    expect(
      runPaintCoverage({
        areaM2: 12,
        coatCount: 2,
        gramsPerM2PerCoat: 62.5,
      }),
    ).toEqual({
      ok: true,
      output: { paintGrams: 1500 },
    }));

  it("accepts a fractional area just above zero", () => {
    const result = runPaintCoverage({ areaM2: 0.01 });
    expect(result.ok).toBe(true);
  });

  it("rejects a zero or negative area", () => {
    for (const areaM2 of [0, -10]) {
      const result = runPaintCoverage({ areaM2 });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_area");
    }
  });

  it("rejects zero coverage", () => {
    const result = runPaintCoverage({ areaM2: 10, gramsPerM2PerCoat: 0 });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_coverage");
  });

  it("rejects a zero or fractional coat count", () => {
    for (const coatCount of [0, 2.5]) {
      const result = runPaintCoverage({ areaM2: 10, coatCount });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid_input");
    }
  });

  it("rejects a missing area", () => {
    const result = runPaintCoverage({});
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects non-finite input", () =>
    expect(runPaintCoverage({ areaM2: Number.POSITIVE_INFINITY }).ok).toBe(
      false,
    ));

  it("rejects unknown input fields", () =>
    expect(runPaintCoverage({ areaM2: 10, extra: 1 } as never).ok).toBe(false));
});
