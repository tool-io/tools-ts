import { describe, expect, it } from "vitest";
import { oilCoverageExample, runOilCoverage } from "./tool.js";

describe("Oil Coverage Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runOilCoverage(oilCoverageExample.input)).toEqual({
      ok: true,
      output: oilCoverageExample.output,
    }));

  it("honors the default coat count and consumption", () =>
    expect(runOilCoverage({ areaM2: 24 })).toEqual({
      ok: true,
      output: { oilLiters: 4.800000000000001 },
    }));

  it("calculates a single coat at the lower boundary", () =>
    expect(
      runOilCoverage({
        areaM2: 24,
        coatCount: 1,
        consumptionLPerM2PerCoat: 0.125,
      }),
    ).toEqual({
      ok: true,
      output: { oilLiters: 3 },
    }));

  it("scales with the number of coats", () =>
    expect(
      runOilCoverage({
        areaM2: 24,
        coatCount: 3,
        consumptionLPerM2PerCoat: 0.125,
      }),
    ).toEqual({
      ok: true,
      output: { oilLiters: 9 },
    }));

  it("handles fractional areas", () =>
    expect(
      runOilCoverage({
        areaM2: 7.25,
        coatCount: 2,
        consumptionLPerM2PerCoat: 0.125,
      }),
    ).toEqual({
      ok: true,
      output: { oilLiters: 1.8125 },
    }));

  it("accepts a fractional area just above zero", () => {
    const result = runOilCoverage({
      areaM2: 0.01,
      coatCount: 2,
      consumptionLPerM2PerCoat: 0.125,
    });
    expect(result.ok).toBe(true);
  });

  it("rejects a zero or negative area", () => {
    for (const areaM2 of [0, -12]) {
      const result = runOilCoverage({ areaM2 });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_area");
    }
  });

  it("rejects zero consumption", () => {
    const result = runOilCoverage({
      areaM2: 12,
      consumptionLPerM2PerCoat: 0,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.issues[0]?.code).toBe("invalid_consumption");
  });

  it("rejects a zero or fractional coat count", () => {
    for (const coatCount of [0, 1.5]) {
      const result = runOilCoverage({ areaM2: 12, coatCount });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("invalid_input");
    }
  });

  it("rejects non-finite input", () =>
    expect(runOilCoverage({ areaM2: Number.NaN }).ok).toBe(false));

  it("rejects unknown input fields", () =>
    expect(runOilCoverage({ areaM2: 12, extra: 1 } as never).ok).toBe(false));
});
