import { describe, expect, it } from "vitest";
import {
  calculateDefectDensityFromYield,
  defectDensityFromYieldExample,
  runDefectDensityFromYield,
} from "./tool.js";
import type { DefectDensityFromYieldOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDefectDensityFromYield>,
): DefectDensityFromYieldOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as DefectDensityFromYieldOutput;
};

describe("Defect Density from Yield", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runDefectDensityFromYield(defectDensityFromYieldExample.input),
    ).toEqual({
      ok: true,
      output: { defectDensityPerCm2: 0.10536051565782631 },
    }));

  it("inverts the Poisson model for a fifty percent yield via runner and direct", () => {
    expect(
      runDefectDensityFromYield({ dieAreaCm2: 2, yieldPercent: 50 }),
    ).toEqual({
      ok: true,
      output: { defectDensityPerCm2: 0.34657359027997264 },
    });
    expect(
      calculateDefectDensityFromYield({ dieAreaCm2: 2, yieldPercent: 50 })
        .defectDensityPerCm2,
    ).toBe(0.34657359027997264);
  });

  it("scales inversely with die area", () =>
    expect(
      runDefectDensityFromYield({ dieAreaCm2: 4, yieldPercent: 90 }),
    ).toEqual({
      ok: true,
      output: { defectDensityPerCm2: 0.026340128914456577 },
    }));

  it("approaches zero defect density near perfect yield", () => {
    const nearPerfect = outputOf(
      runDefectDensityFromYield({ dieAreaCm2: 1, yieldPercent: 99.9999 }),
    ).defectDensityPerCm2;
    expect(nearPerfect).toBeLessThan(1e-5);
    const direct = calculateDefectDensityFromYield({
      dieAreaCm2: 1,
      yieldPercent: 99.9999,
    }).defectDensityPerCm2;
    expect(direct).toBeLessThan(1e-5);
  });

  it("rejects missing required inputs", () => {
    expect(runDefectDensityFromYield({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field" }] },
      ok: false,
    });
    expect(runDefectDensityFromYield({ dieAreaCm2: 1 } as never).ok).toBe(
      false,
    );
    expect(runDefectDensityFromYield({ yieldPercent: 90 } as never).ok).toBe(
      false,
    );
  });

  it("rejects wrong type inputs", () => {
    expect(
      runDefectDensityFromYield({
        dieAreaCm2: "1" as never,
        yieldPercent: 90,
      }).ok,
    ).toBe(false);
    expect(
      runDefectDensityFromYield({
        dieAreaCm2: 1,
        yieldPercent: "90" as never,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDefectDensityFromYield({
        dieAreaCm2: "1" as unknown as number,
        yieldPercent: 90,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown input fields", () =>
    expect(
      runDefectDensityFromYield({
        dieAreaCm2: 1,
        extra: true,
        yieldPercent: 90,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));

  it("rejects non-object input", () => {
    expect(runDefectDensityFromYield(null as never).ok).toBe(false);
    if (!runDefectDensityFromYield(null as never).ok)
      expect(
        runDefectDensityFromYield(null as never).error.issues[0].code,
      ).toBe("object_required");
    expect(runDefectDensityFromYield([] as never).ok).toBe(false);
    expect(runDefectDensityFromYield(1 as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDefectDensityFromYield({ dieAreaCm2: bad, yieldPercent: 90 }).ok,
      ).toBe(false);
      expect(
        runDefectDensityFromYield({ dieAreaCm2: 1, yieldPercent: bad }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDefectDensityFromYield>[0];
      field: string;
    }> = [
      {
        input: { dieAreaCm2: Number.NaN, yieldPercent: 90 },
        field: "dieAreaCm2",
      },
      {
        input: { dieAreaCm2: Number.POSITIVE_INFINITY, yieldPercent: 90 },
        field: "dieAreaCm2",
      },
      {
        input: { dieAreaCm2: 1, yieldPercent: Number.NaN },
        field: "yieldPercent",
      },
      {
        input: { dieAreaCm2: 1, yieldPercent: Number.POSITIVE_INFINITY },
        field: "yieldPercent",
      },
      {
        input: { dieAreaCm2: 1, yieldPercent: Number.NEGATIVE_INFINITY },
        field: "yieldPercent",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDefectDensityFromYield(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("accepts perfect yield and rejects invalid yield or non-positive area", () => {
    const zeroYield = runDefectDensityFromYield({
      dieAreaCm2: 1,
      yieldPercent: 0,
    });
    expect(zeroYield.ok).toBe(false);
    if (!zeroYield.ok)
      expect(["invalid_field", "invalid_yield"]).toContain(
        zeroYield.error.issues[0].code,
      );
    expect(
      runDefectDensityFromYield({ dieAreaCm2: 1, yieldPercent: 100 }),
    ).toEqual({
      ok: true,
      output: { defectDensityPerCm2: 0 },
    });
    expect(
      runDefectDensityFromYield({ dieAreaCm2: 1, yieldPercent: -5 }).ok,
    ).toBe(false);
    expect(
      runDefectDensityFromYield({ dieAreaCm2: 1, yieldPercent: 150 }).ok,
    ).toBe(false);
    expect(
      runDefectDensityFromYield({ dieAreaCm2: 0, yieldPercent: 90 }),
    ).toMatchObject({
      error: { issues: [{ field: "dieAreaCm2" }] },
      ok: false,
    });
    expect(
      runDefectDensityFromYield({ dieAreaCm2: -1, yieldPercent: 90 }).ok,
    ).toBe(false);

    let err: unknown = null;
    try {
      calculateDefectDensityFromYield({ dieAreaCm2: 0, yieldPercent: 90 });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("dieAreaCm2");
    err = null;
    try {
      calculateDefectDensityFromYield({ dieAreaCm2: 1, yieldPercent: 0 });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_yield");
    expect(
      calculateDefectDensityFromYield({ dieAreaCm2: 1, yieldPercent: 100 }),
    ).toEqual({ defectDensityPerCm2: 0 });
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateDefectDensityFromYield(defectDensityFromYieldExample.input)
        .defectDensityPerCm2,
    ).toBe(defectDensityFromYieldExample.output.defectDensityPerCm2);
    expect(
      calculateDefectDensityFromYield({ dieAreaCm2: 4, yieldPercent: 90 })
        .defectDensityPerCm2,
    ).toBe(0.026340128914456577);
    expect(() =>
      calculateDefectDensityFromYield({ dieAreaCm2: 0, yieldPercent: 90 }),
    ).toThrow();
    expect(() =>
      calculateDefectDensityFromYield({
        dieAreaCm2: 1,
        yieldPercent: Number.NaN,
      }),
    ).toThrow();
  });

  it("preserves Poisson inverse and scaling properties", () => {
    // Inverse: yield = exp(-D*A)*100
    const input = { dieAreaCm2: 2, yieldPercent: 50 };
    const d = calculateDefectDensityFromYield(input).defectDensityPerCm2;
    const recoveredYield = Math.exp(-d * input.dieAreaCm2) * 100;
    expect(recoveredYield).toBeCloseTo(input.yieldPercent, 12);

    // scaling inversely with area
    const d1 = calculateDefectDensityFromYield({
      dieAreaCm2: 1,
      yieldPercent: 90,
    }).defectDensityPerCm2;
    const d4 = calculateDefectDensityFromYield({
      dieAreaCm2: 4,
      yieldPercent: 90,
    }).defectDensityPerCm2;
    expect(d4).toBeCloseTo(d1 / 4, 12);

    // monotonic: lower yield => higher D, smaller area => higher D
    const highYield = calculateDefectDensityFromYield({
      dieAreaCm2: 1,
      yieldPercent: 90,
    }).defectDensityPerCm2;
    const lowYield = calculateDefectDensityFromYield({
      dieAreaCm2: 1,
      yieldPercent: 10,
    }).defectDensityPerCm2;
    expect(lowYield).toBeGreaterThan(highYield);

    const largeArea = calculateDefectDensityFromYield({
      dieAreaCm2: 10,
      yieldPercent: 50,
    }).defectDensityPerCm2;
    const smallArea = calculateDefectDensityFromYield({
      dieAreaCm2: 1,
      yieldPercent: 50,
    }).defectDensityPerCm2;
    expect(smallArea).toBeGreaterThan(largeArea);
  });

  it("handles extremes without -0 and preserves full precision", () => {
    const nearZero = calculateDefectDensityFromYield({
      dieAreaCm2: 1,
      yieldPercent: 99.9999,
    }).defectDensityPerCm2;
    expect(nearZero).toBeGreaterThanOrEqual(0);
    expect(Object.is(nearZero, -0)).toBe(false);

    const highDefect = calculateDefectDensityFromYield({
      dieAreaCm2: 0.01,
      yieldPercent: 0.01,
    }).defectDensityPerCm2;
    expect(Number.isFinite(highDefect)).toBe(true);
    expect(highDefect).toBeCloseTo(921.0340371976183, 9);

    const direct = calculateDefectDensityFromYield(
      defectDensityFromYieldExample.input,
    ).defectDensityPerCm2;
    const viaRunner = outputOf(
      runDefectDensityFromYield(defectDensityFromYieldExample.input),
    ).defectDensityPerCm2;
    expect(direct).toBe(viaRunner);
    expect(direct).toBe(
      defectDensityFromYieldExample.output.defectDensityPerCm2,
    );
    expect(direct.toString()).not.toBe("0.1054");
  });
});
