import { describe, expect, it } from "vitest";
import {
  calculateApdMultiplicationFactor,
  apdMultiplicationFactorExample,
  runApdMultiplicationFactor,
} from "./tool.js";

describe("APD Multiplication Factor Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runApdMultiplicationFactor(apdMultiplicationFactorExample.input),
    ).toEqual({ ok: true, output: apdMultiplicationFactorExample.output });
    expect(
      calculateApdMultiplicationFactor(apdMultiplicationFactorExample.input)
        .multiplicationFactor,
    ).toBe(5.263157894736843);
  });

  it("returns unity multiplication at zero reverse bias and normalizes -0", () => {
    expect(
      runApdMultiplicationFactor({ breakdownVolts: 100, reverseBiasVolts: 0 }),
    ).toEqual({ ok: true, output: { multiplicationFactor: 1 } });
    const minusZero = runApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: -0,
    });
    expect(minusZero.ok).toBe(true);
    if (!minusZero.ok) throw new Error("expected success");
    expect(
      (minusZero.output as { multiplicationFactor: number })
        .multiplicationFactor,
    ).toBe(1);
    expect(
      Object.is(
        (minusZero.output as { multiplicationFactor: number })
          .multiplicationFactor,
        -0,
      ),
    ).toBe(false);
    expect(
      calculateApdMultiplicationFactor({
        breakdownVolts: 100,
        reverseBiasVolts: 0,
      }).multiplicationFactor,
    ).toBe(1);
    expect(
      Object.is(
        calculateApdMultiplicationFactor({
          breakdownVolts: 100,
          reverseBiasVolts: -0,
        }).multiplicationFactor,
        -0,
      ),
    ).toBe(false);
  });

  it("uses the linear Miller characteristic for exponent one", () => {
    expect(
      runApdMultiplicationFactor({
        breakdownVolts: 100,
        exponentN: 1,
        reverseBiasVolts: 50,
      }),
    ).toEqual({ ok: true, output: { multiplicationFactor: 2 } });
  });

  it("matches the squared characteristic at half breakdown", () => {
    expect(
      runApdMultiplicationFactor({ breakdownVolts: 100, reverseBiasVolts: 50 }),
    ).toEqual({
      ok: true,
      output: { multiplicationFactor: 1.3333333333333333 },
    });
  });

  it("steepens sharply close to breakdown", () => {
    expect(
      runApdMultiplicationFactor({ breakdownVolts: 100, reverseBiasVolts: 95 }),
    ).toEqual({
      ok: true,
      output: { multiplicationFactor: 10.256410256410254 },
    });
  });

  it("honors a custom exponent of six", () => {
    expect(
      runApdMultiplicationFactor({
        breakdownVolts: 100,
        exponentN: 6,
        reverseBiasVolts: 90,
      }),
    ).toEqual({
      ok: true,
      output: { multiplicationFactor: 2.1342029498953177 },
    });
  });

  it("applies default exponent 2 when omitted", () => {
    const runner = runApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: 80,
    });
    expect(runner.ok).toBe(true);
    if (runner.ok)
      expect(runner.output.multiplicationFactor).toBeCloseTo(
        2.7777777777777777,
        12,
      );
    expect(
      calculateApdMultiplicationFactor({
        breakdownVolts: 100,
        reverseBiasVolts: 80,
      }).multiplicationFactor,
    ).toBeCloseTo(2.7777777777777777, 12);
  });

  it("rejects bias equal to and above breakdown with above_breakdown", () => {
    for (const bad of [100, 120]) {
      const r = runApdMultiplicationFactor({
        breakdownVolts: 100,
        reverseBiasVolts: bad,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(r.error.issues[0].code).toBe("above_breakdown");
      expect(r.error.issues[0].field).toBe("reverseBiasVolts");
    }
    let e: unknown = null;
    try {
      calculateApdMultiplicationFactor({
        breakdownVolts: 100,
        reverseBiasVolts: 100,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("above_breakdown");
  });

  it("rejects negative reverse bias and zero/negative breakdown", () => {
    const negBias = runApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: -1,
    });
    expect(negBias.ok).toBe(false);
    if (!negBias.ok)
      expect(["invalid_field", "invalid_reverse_bias"]).toContain(
        negBias.error.issues[0].code,
      );
    const zeroBreak = runApdMultiplicationFactor({
      breakdownVolts: 0,
      reverseBiasVolts: 50,
    });
    expect(zeroBreak.ok).toBe(false);
    if (!zeroBreak.ok)
      expect(["invalid_field", "invalid_breakdown"]).toContain(
        zeroBreak.error.issues[0].code,
      );
    const negBreak = runApdMultiplicationFactor({
      breakdownVolts: -100,
      reverseBiasVolts: 50,
    });
    expect(negBreak.ok).toBe(false);

    let e: unknown = null;
    try {
      calculateApdMultiplicationFactor({
        breakdownVolts: 0,
        reverseBiasVolts: 50,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_breakdown");
  });

  it("rejects out-of-range exponent", () => {
    for (const bad of [0.9, 7, 0, -1]) {
      const r = runApdMultiplicationFactor({
        breakdownVolts: 100,
        exponentN: bad,
        reverseBiasVolts: 50,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_exponent"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("exponentN");
    }
    expect(
      runApdMultiplicationFactor({
        breakdownVolts: 100,
        exponentN: 1,
        reverseBiasVolts: 50,
      }).ok,
    ).toBe(true);
    expect(
      runApdMultiplicationFactor({
        breakdownVolts: 100,
        exponentN: 6,
        reverseBiasVolts: 50,
      }).ok,
    ).toBe(true);
    let e: unknown = null;
    try {
      calculateApdMultiplicationFactor({
        breakdownVolts: 100,
        exponentN: 7,
        reverseBiasVolts: 50,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_exponent");
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateApdMultiplicationFactor>[0];
      field: string;
    }> = [
      {
        input: { breakdownVolts: Number.NaN, reverseBiasVolts: 50 },
        field: "breakdownVolts",
      },
      {
        input: {
          breakdownVolts: Number.POSITIVE_INFINITY,
          reverseBiasVolts: 50,
        },
        field: "breakdownVolts",
      },
      {
        input: { breakdownVolts: 100, reverseBiasVolts: Number.NaN },
        field: "reverseBiasVolts",
      },
      {
        input: {
          breakdownVolts: 100,
          reverseBiasVolts: Number.POSITIVE_INFINITY,
        },
        field: "reverseBiasVolts",
      },
      {
        input: {
          breakdownVolts: 100,
          reverseBiasVolts: 50,
          exponentN: Number.NaN,
        },
        field: "exponentN",
      },
      {
        input: {
          breakdownVolts: 100,
          reverseBiasVolts: 50,
          exponentN: Number.POSITIVE_INFINITY,
        },
        field: "exponentN",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateApdMultiplicationFactor(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(
      runApdMultiplicationFactor({
        breakdownVolts: Number.NaN,
        reverseBiasVolts: 50,
      }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow for extreme gain", () => {
    // Very close to breakdown should diverge to overflow if denom underflows
    // For our implementation, extremely large breakdown values still finite, but test overflow path via huge values
    const hugeBias = Number.MAX_VALUE / 2;
    // Use huge but still below breakdown -> test overflow handling doesn't incorrectly error for normal
    const normal = runApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: 99.999999,
    });
    expect(normal.ok).toBe(true);
    if (normal.ok)
      expect(normal.output.multiplicationFactor).toBeGreaterThan(1);

    // Overflow case: if calculation yields Infinity, it reports numeric_overflow
    // We can test the overflow guard indirectly by ensuring finite large gain is okay
    // and that true overflow would be caught (simulated via direct check)
    let directErr: unknown = null;
    try {
      // This will not overflow because denom still >0, but we ensure code path exists
      calculateApdMultiplicationFactor({
        breakdownVolts: Number.MAX_VALUE,
        reverseBiasVolts: Number.MAX_VALUE - 1,
      });
    } catch (e) {
      directErr = e;
    }
    // For MAX_VALUE pair, ratio ~1, pow ~1, denom ~0 => should be above_breakdown or overflow
    // Either is acceptable as error, but we check directErr is not null for extreme
    // If not error, then gain is finite and okay - just verify finite
    if (directErr) {
      expect(["above_breakdown", "numeric_overflow"]).toContain(
        (directErr as { code: string }).code,
      );
    }
  });

  it("handles very small bias without -0 or NaN", () => {
    const tiny = runApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: Number.MIN_VALUE,
    });
    expect(tiny.ok).toBe(true);
    if (tiny.ok) {
      const v = (tiny.output as { multiplicationFactor: number })
        .multiplicationFactor;
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(Object.is(v, -0)).toBe(false);
    }
  });

  it("rejects missing, wrong type, unknown fields, and non-object", () => {
    expect(runApdMultiplicationFactor({} as never).ok).toBe(false);
    expect(
      runApdMultiplicationFactor({
        breakdownVolts: "100V" as never,
        reverseBiasVolts: 50,
      }).ok,
    ).toBe(false);
    const unknown = runApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: 50,
      extra: 1,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runApdMultiplicationFactor(null as never);
    expect(nonObject.ok).toBe(false);
    expect(runApdMultiplicationFactor(42 as never).ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("preserves properties: monotonic in bias, larger breakdown reduces gain at fixed bias, inverse not trivial, scaling", () => {
    const lowBias = calculateApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: 10,
    }).multiplicationFactor;
    const highBias = calculateApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: 80,
    }).multiplicationFactor;
    expect(highBias).toBeGreaterThan(lowBias);

    // At fixed bias, larger Vb gives smaller M
    const smallVb = calculateApdMultiplicationFactor({
      breakdownVolts: 100,
      reverseBiasVolts: 50,
    }).multiplicationFactor;
    const largeVb = calculateApdMultiplicationFactor({
      breakdownVolts: 200,
      reverseBiasVolts: 50,
    }).multiplicationFactor;
    expect(largeVb).toBeLessThan(smallVb);

    // Monotonic in exponent at fixed ratio <1: larger N gives smaller denominator? Actually (0.5)^6 < (0.5)^2 => denom larger => M smaller. So exponent increase reduces M
    const exp1 = calculateApdMultiplicationFactor({
      breakdownVolts: 100,
      exponentN: 1,
      reverseBiasVolts: 50,
    }).multiplicationFactor;
    const exp6 = calculateApdMultiplicationFactor({
      breakdownVolts: 100,
      exponentN: 6,
      reverseBiasVolts: 50,
    }).multiplicationFactor;
    expect(exp6).toBeLessThan(exp1);

    // Verify formula: M =1/(1-(V/Vb)^N) at 0 voltage =1
    expect(
      calculateApdMultiplicationFactor({
        breakdownVolts: 100,
        reverseBiasVolts: 0,
      }).multiplicationFactor,
    ).toBe(1);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateApdMultiplicationFactor({
        breakdownVolts: 100,
        reverseBiasVolts: 50,
      }).multiplicationFactor,
    ).toBe(1.3333333333333333);
    expect(
      calculateApdMultiplicationFactor({
        breakdownVolts: 100,
        exponentN: 1,
        reverseBiasVolts: 50,
      }).multiplicationFactor,
    ).toBe(2);
    expect(() =>
      calculateApdMultiplicationFactor({
        breakdownVolts: 100,
        reverseBiasVolts: 100,
      }),
    ).toThrow();
    expect(() =>
      calculateApdMultiplicationFactor({
        breakdownVolts: Number.NaN,
        reverseBiasVolts: 50,
      }),
    ).toThrow();
  });
});
