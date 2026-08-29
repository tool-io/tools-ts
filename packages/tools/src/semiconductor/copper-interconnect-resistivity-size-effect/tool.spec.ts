import { describe, expect, it } from "vitest";
import {
  calculateCopperInterconnectResistivitySizeEffect,
  copperInterconnectResistivitySizeEffectExample,
  runCopperInterconnectResistivitySizeEffect,
} from "./tool.js";
import type { CopperInterconnectResistivitySizeEffectOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runCopperInterconnectResistivitySizeEffect>,
): CopperInterconnectResistivitySizeEffectOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as CopperInterconnectResistivitySizeEffectOutput;
};

describe("Copper Size Effect Calculator", () => {
  it("reproduces its canonical example exactly with defaults", () =>
    expect(
      runCopperInterconnectResistivitySizeEffect(
        copperInterconnectResistivitySizeEffectExample.input,
      ),
    ).toEqual({
      ok: true,
      output: { resistivityIncreasePercent: 79.8 },
    }));

  it("doubles the increase when linewidth halves via runner and direct", () => {
    expect(
      runCopperInterconnectResistivitySizeEffect({ linewidthNm: 10 }),
    ).toEqual({
      ok: true,
      output: { resistivityIncreasePercent: 159.6 },
    });
    expect(
      calculateCopperInterconnectResistivitySizeEffect({ linewidthNm: 10 })
        .resistivityIncreasePercent,
    ).toBe(159.6);
  });

  it("accepts explicit coefficient and mean free path", () =>
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        meanFreePathNm: 40,
        sizeEffectCoefficient: 0.5,
      }),
    ).toEqual({ ok: true, output: { resistivityIncreasePercent: 100 } }));

  it("yields zero increase for a zero coefficient and normalizes -0", () => {
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        meanFreePathNm: 39.9,
        sizeEffectCoefficient: 0,
      }),
    ).toEqual({ ok: true, output: { resistivityIncreasePercent: 0 } });
    const direct = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 20,
      meanFreePathNm: 39.9,
      sizeEffectCoefficient: 0,
    }).resistivityIncreasePercent;
    expect(direct).toBe(0);
    expect(Object.is(direct, -0)).toBe(false);
    const minusZero = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 20,
      meanFreePathNm: 39.9,
      sizeEffectCoefficient: -0,
    }).resistivityIncreasePercent;
    expect(Object.is(minusZero, -0)).toBe(false);
  });

  it("rejects missing required inputs", () => {
    expect(
      runCopperInterconnectResistivitySizeEffect({} as never),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "linewidthNm" }] },
      ok: false,
    });
  });

  it("rejects wrong type inputs", () => {
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: "20" as never,
      }).ok,
    ).toBe(false);
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        meanFreePathNm: "39.9" as never,
      }).ok,
    ).toBe(false);
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        sizeEffectCoefficient: "0.4" as never,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown input fields", () =>
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        extra: 1,
      } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));

  it("rejects non-object input", () => {
    const nonObject = runCopperInterconnectResistivitySizeEffect(null as never);
    expect(nonObject.ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
    expect(runCopperInterconnectResistivitySizeEffect([] as never).ok).toBe(
      false,
    );
    expect(runCopperInterconnectResistivitySizeEffect(42 as never).ok).toBe(
      false,
    );
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runCopperInterconnectResistivitySizeEffect({ linewidthNm: bad }).ok,
      ).toBe(false);
      expect(
        runCopperInterconnectResistivitySizeEffect({
          linewidthNm: 20,
          meanFreePathNm: bad,
        }).ok,
      ).toBe(false);
      expect(
        runCopperInterconnectResistivitySizeEffect({
          linewidthNm: 20,
          sizeEffectCoefficient: bad,
        }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<
        typeof calculateCopperInterconnectResistivitySizeEffect
      >[0];
      field: string;
    }> = [
      {
        input: { linewidthNm: Number.NaN },
        field: "linewidthNm",
      },
      {
        input: { linewidthNm: Number.POSITIVE_INFINITY },
        field: "linewidthNm",
      },
      {
        input: { linewidthNm: 20, meanFreePathNm: Number.NaN },
        field: "meanFreePathNm",
      },
      {
        input: { linewidthNm: 20, meanFreePathNm: Number.POSITIVE_INFINITY },
        field: "meanFreePathNm",
      },
      {
        input: { linewidthNm: 20, sizeEffectCoefficient: Number.NaN },
        field: "sizeEffectCoefficient",
      },
      {
        input: {
          linewidthNm: 20,
          sizeEffectCoefficient: Number.NEGATIVE_INFINITY,
        },
        field: "sizeEffectCoefficient",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateCopperInterconnectResistivitySizeEffect(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: zero/negative linewidth, zero/negative mean free path, negative coefficient", () => {
    expect(
      runCopperInterconnectResistivitySizeEffect({ linewidthNm: 0 }),
    ).toMatchObject({
      error: { issues: [{ field: "linewidthNm" }] },
      ok: false,
    });
    expect(
      runCopperInterconnectResistivitySizeEffect({ linewidthNm: -20 }),
    ).toMatchObject({
      error: { issues: [{ field: "linewidthNm" }] },
      ok: false,
    });
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        meanFreePathNm: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ field: "meanFreePathNm" }] },
      ok: false,
    });
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        meanFreePathNm: -5,
      }).ok,
    ).toBe(false);
    expect(
      runCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        meanFreePathNm: 39.9,
        sizeEffectCoefficient: -0.4,
      }),
    ).toMatchObject({
      error: { issues: [{ field: "sizeEffectCoefficient" }] },
      ok: false,
    });

    let err: unknown = null;
    try {
      calculateCopperInterconnectResistivitySizeEffect({ linewidthNm: 0 });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("degenerate_input");
    expect((err as { field: string }).field).toBe("linewidthNm");

    err = null;
    try {
      calculateCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        sizeEffectCoefficient: -1,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_value");
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateCopperInterconnectResistivitySizeEffect(
        copperInterconnectResistivitySizeEffectExample.input,
      ).resistivityIncreasePercent,
    ).toBe(
      copperInterconnectResistivitySizeEffectExample.output
        .resistivityIncreasePercent,
    );
    expect(
      calculateCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        meanFreePathNm: 40,
        sizeEffectCoefficient: 0.5,
      }).resistivityIncreasePercent,
    ).toBe(100);
    expect(() =>
      calculateCopperInterconnectResistivitySizeEffect({ linewidthNm: 0 }),
    ).toThrow();
    expect(() =>
      calculateCopperInterconnectResistivitySizeEffect({
        linewidthNm: 20,
        meanFreePathNm: Number.NaN,
      }),
    ).toThrow();
  });

  it("scales inversely with linewidth and linearly with k and lambda", () => {
    const base = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 20,
      meanFreePathNm: 39.9,
      sizeEffectCoefficient: 0.4,
    }).resistivityIncreasePercent;
    const halfWidth = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 10,
      meanFreePathNm: 39.9,
      sizeEffectCoefficient: 0.4,
    }).resistivityIncreasePercent;
    expect(halfWidth).toBeCloseTo(base * 2, 12);
    const doubleCoeff = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 20,
      meanFreePathNm: 39.9,
      sizeEffectCoefficient: 0.8,
    }).resistivityIncreasePercent;
    expect(doubleCoeff).toBeCloseTo(base * 2, 12);
    const doubleMfp = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 20,
      meanFreePathNm: 79.8,
      sizeEffectCoefficient: 0.4,
    }).resistivityIncreasePercent;
    expect(doubleMfp).toBeCloseTo(base * 2, 12);

    // via runner inverse check: percent = 100*k*lambda/w => w =100*k*lambda/percent
    const percent = outputOf(
      runCopperInterconnectResistivitySizeEffect({ linewidthNm: 20 }),
    ).resistivityIncreasePercent;
    const recoveredW = (100 * 0.4 * 39.9) / percent;
    expect(recoveredW).toBeCloseTo(20, 12);
  });

  it("is monotonic and handles overflow gracefully", () => {
    const smallW = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 5,
    }).resistivityIncreasePercent;
    const largeW = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 100,
    }).resistivityIncreasePercent;
    expect(smallW).toBeGreaterThan(largeW);

    const smallCoeff = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 20,
      sizeEffectCoefficient: 0.1,
    }).resistivityIncreasePercent;
    const largeCoeff = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 20,
      sizeEffectCoefficient: 1,
    }).resistivityIncreasePercent;
    expect(largeCoeff).toBeGreaterThan(smallCoeff);

    // huge values that still finite
    const huge = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 1,
      meanFreePathNm: 1e100,
      sizeEffectCoefficient: 1,
    }).resistivityIncreasePercent;
    expect(Number.isFinite(huge)).toBe(true);

    // overflow should throw numeric_overflow
    expect(() =>
      calculateCopperInterconnectResistivitySizeEffect({
        linewidthNm: 1e-308,
        meanFreePathNm: 1e308,
        sizeEffectCoefficient: 1e308,
      }),
    ).toThrow();
  });

  it("preserves full precision without rounding", () => {
    const direct = calculateCopperInterconnectResistivitySizeEffect({
      linewidthNm: 20,
    }).resistivityIncreasePercent;
    expect(direct).toBe(79.8);
    expect(direct.toString()).toBe("79.8");
    const viaRunner = outputOf(
      runCopperInterconnectResistivitySizeEffect({ linewidthNm: 20 }),
    ).resistivityIncreasePercent;
    expect(viaRunner).toBe(direct);
  });
});
