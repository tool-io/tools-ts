import { describe, expect, it } from "vitest";
import {
  calculateAvalancheBreakdownVoltage,
  avalancheBreakdownVoltageExample,
  runAvalancheBreakdownVoltage,
} from "./tool.js";

describe("Avalanche Breakdown Voltage Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runAvalancheBreakdownVoltage(avalancheBreakdownVoltageExample.input),
    ).toEqual({
      ok: true,
      output: avalancheBreakdownVoltageExample.output,
    }));

  it("applies the triangular-field conversion factor", () => {
    const result = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 1,
      depletionWidthUm: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected success");
    expect(result.output.breakdownVolts).toBeCloseTo(50, 12);
    expect(
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: 1,
        depletionWidthUm: 1,
      }).breakdownVolts,
    ).toBeCloseTo(50, 12);
  });

  it("scales linearly with depletion width", () => {
    const short = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.3,
      depletionWidthUm: 1,
    });
    const long = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.3,
      depletionWidthUm: 10,
    });
    expect(short.ok).toBe(true);
    expect(long.ok).toBe(true);
    if (!short.ok || !long.ok) throw new Error("expected success");
    expect(
      (long.output as { breakdownVolts: number }).breakdownVolts,
    ).toBeCloseTo(
      10 * (short.output as { breakdownVolts: number }).breakdownVolts,
      12,
    );
  });

  it("scales linearly with critical field", () => {
    const silicon = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.3,
      depletionWidthUm: 2,
    });
    const gan = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 3.3,
      depletionWidthUm: 2,
    });
    expect(silicon.ok).toBe(true);
    expect(gan.ok).toBe(true);
    if (!silicon.ok || !gan.ok) throw new Error("expected success");
    expect(
      (gan.output as { breakdownVolts: number }).breakdownVolts,
    ).toBeCloseTo(
      (3.3 / 0.3) *
        (silicon.output as { breakdownVolts: number }).breakdownVolts,
      12,
    );
  });

  it("returns very small voltages for minimal inputs and normalizes -0", () => {
    const tiny = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: Number.MIN_VALUE,
      depletionWidthUm: Number.MIN_VALUE,
    });
    if (tiny.ok) {
      const v = (tiny.output as { breakdownVolts: number }).breakdownVolts;
      expect(Number.isFinite(v)).toBe(true);
      expect(Object.is(v, -0)).toBe(false);
      expect(v).toBeGreaterThanOrEqual(0);
    } else {
      expect(tiny.error.issues[0].code).toBe("numeric_underflow");
    }
  });

  it("rejects zero critical field", () => {
    const r = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0,
      depletionWidthUm: 2,
    });
    expect(r).toMatchObject({
      error: { issues: [{ field: "criticalFieldMVPerCm" }] },
      ok: false,
    });
    expect(["invalid_field", "invalid_critical_field"]).toContain(
      (r as { ok: false; error: { issues: Array<{ code: string }> } }).error
        .issues[0].code,
    );
    let e: unknown = null;
    try {
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: 0,
        depletionWidthUm: 2,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_critical_field");
  });

  it("rejects zero depletion width", () =>
    expect(
      runAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: 0.3,
        depletionWidthUm: 0,
      }),
    ).toMatchObject({
      error: { issues: [{ field: "depletionWidthUm" }] },
      ok: false,
    }));

  it("rejects negative inputs", () => {
    const negativeField = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: -0.3,
      depletionWidthUm: 2,
    });
    const negativeWidth = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.3,
      depletionWidthUm: -2,
    });
    expect(negativeField.ok).toBe(false);
    expect(negativeWidth.ok).toBe(false);
    expect(() =>
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: -0.3,
        depletionWidthUm: 2,
      }),
    ).toThrow();
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateAvalancheBreakdownVoltage>[0];
      field: string;
    }> = [
      {
        input: { criticalFieldMVPerCm: Number.NaN, depletionWidthUm: 2 },
        field: "criticalFieldMVPerCm",
      },
      {
        input: {
          criticalFieldMVPerCm: Number.POSITIVE_INFINITY,
          depletionWidthUm: 2,
        },
        field: "criticalFieldMVPerCm",
      },
      {
        input: {
          criticalFieldMVPerCm: Number.NEGATIVE_INFINITY,
          depletionWidthUm: 2,
        },
        field: "criticalFieldMVPerCm",
      },
      {
        input: { criticalFieldMVPerCm: 0.3, depletionWidthUm: Number.NaN },
        field: "depletionWidthUm",
      },
      {
        input: {
          criticalFieldMVPerCm: 0.3,
          depletionWidthUm: Number.POSITIVE_INFINITY,
        },
        field: "depletionWidthUm",
      },
      {
        input: {
          criticalFieldMVPerCm: 0.3,
          depletionWidthUm: Number.NEGATIVE_INFINITY,
        },
        field: "depletionWidthUm",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateAvalancheBreakdownVoltage(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(
      runAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: Number.POSITIVE_INFINITY,
        depletionWidthUm: 2,
      }).ok,
    ).toBe(false);
    expect(
      runAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: 0.3,
        depletionWidthUm: Number.NaN,
      }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow against an input field", () => {
    let directErr: unknown = null;
    try {
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: Number.MAX_VALUE,
        depletionWidthUm: Number.MAX_VALUE,
      });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("numeric_overflow");
    expect((directErr as { field: string }).field).toBe("criticalFieldMVPerCm");

    const runner = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: Number.MAX_VALUE,
      depletionWidthUm: Number.MAX_VALUE,
    });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(runner.error.issues[0].code).toBe("numeric_overflow");
  });

  it("keeps wide high-field devices finite when product is finite", () => {
    const result = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 10,
      depletionWidthUm: 1e2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected success");
    expect(Number.isFinite(result.output.breakdownVolts)).toBe(true);
    expect(result.output.breakdownVolts).toBe(50000);
  });

  it("reports an unrepresentable positive voltage as numeric underflow", () => {
    expect(() =>
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: Number.MIN_VALUE,
        depletionWidthUm: 1e-308,
      }),
    ).toThrow();
  });

  it("rejects missing, wrong type, unknown fields, and non-object", () => {
    expect(runAvalancheBreakdownVoltage({} as never).ok).toBe(false);
    expect(
      runAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: "high" as never,
        depletionWidthUm: 2,
      }).ok,
    ).toBe(false);
    const unknown = runAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.3,
      depletionWidthUm: 2,
      extra: 1,
    } as never);
    expect(unknown).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    expect(runAvalancheBreakdownVoltage(null as never).ok).toBe(false);
    expect(runAvalancheBreakdownVoltage(42 as never).ok).toBe(false);
    if (!runAvalancheBreakdownVoltage(null as never).ok)
      expect(
        runAvalancheBreakdownVoltage(null as never).error.issues[0].code,
      ).toBe("object_required");
  });

  it("preserves properties: V=W*E*50 for a triangular field profile", () => {
    const base = calculateAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.3,
      depletionWidthUm: 2,
    }).breakdownVolts;
    expect(base).toBeCloseTo(30, 12);

    const doubleW = calculateAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.3,
      depletionWidthUm: 4,
    }).breakdownVolts;
    expect(doubleW).toBeCloseTo(base * 2, 12);

    const doubleE = calculateAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.6,
      depletionWidthUm: 2,
    }).breakdownVolts;
    expect(doubleE).toBeCloseTo(base * 2, 12);

    const bothDouble = calculateAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.6,
      depletionWidthUm: 4,
    }).breakdownVolts;
    expect(bothDouble).toBeCloseTo(base * 4, 12);

    // inverse
    const recoveredField = base / (2 * 50);
    expect(recoveredField).toBeCloseTo(0.3, 12);
    const recoveredWidth = base / (0.3 * 50);
    expect(recoveredWidth).toBeCloseTo(2, 12);

    // monotonic
    const low = calculateAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 0.1,
      depletionWidthUm: 1,
    }).breakdownVolts;
    const high = calculateAvalancheBreakdownVoltage({
      criticalFieldMVPerCm: 10,
      depletionWidthUm: 10,
    }).breakdownVolts;
    expect(high).toBeGreaterThan(low);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: 0.3,
        depletionWidthUm: 2,
      }).breakdownVolts,
    ).toBeCloseTo(30, 12);
    expect(
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: 1,
        depletionWidthUm: 1,
      }).breakdownVolts,
    ).toBeCloseTo(50, 12);
    expect(() =>
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: 0,
        depletionWidthUm: 2,
      }),
    ).toThrow();
    expect(() =>
      calculateAvalancheBreakdownVoltage({
        criticalFieldMVPerCm: Number.NaN,
        depletionWidthUm: 2,
      }),
    ).toThrow();
  });
});
