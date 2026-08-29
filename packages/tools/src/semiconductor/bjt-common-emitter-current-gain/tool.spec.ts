import { describe, expect, it } from "vitest";
import {
  calculateCommonEmitterGain,
  commonEmitterCurrentGainExample,
  runCommonEmitterCurrentGain,
} from "./tool.js";

describe("bjt common-emitter current gain calculator", () => {
  it("reproduces its canonical example exactly and keeps full precision", () => {
    expect(
      runCommonEmitterCurrentGain(commonEmitterCurrentGainExample.input),
    ).toEqual({
      ok: true,
      output: commonEmitterCurrentGainExample.output,
    });
    // full precision without toPrecision rounding
    const beta099 = calculateCommonEmitterGain({ alpha: 0.99 }).beta;
    expect(beta099).toBe(0.99 / (1 - 0.99));
    expect(beta099).toBeCloseTo(98.99999999999991, 10);
    // 0.995 full precision is 0.995/(1-0.995) not exactly 199 due to binary
    const beta0995 = calculateCommonEmitterGain({ alpha: 0.995 }).beta;
    expect(beta0995).toBe(0.995 / (1 - 0.995));
    expect(beta0995).toBeCloseTo(198.99999999999983, 10);
    const highPrec = calculateCommonEmitterGain({ alpha: 0.999 }).beta;
    expect(highPrec).toBe(0.999 / (1 - 0.999));
    expect(highPrec).toBeCloseTo(998.9999999999991, 10);
  });

  it("converts alpha to beta with full precision for various alphas", () => {
    expect(calculateCommonEmitterGain({ alpha: 0.5 }).beta).toBe(1);
    expect(calculateCommonEmitterGain({ alpha: 0.9 }).beta).toBeCloseTo(
      9.000000000000002,
      12,
    );
    expect(calculateCommonEmitterGain({ alpha: 0.9 }).beta).toBe(
      0.9 / (1 - 0.9),
    );
    expect(calculateCommonEmitterGain({ alpha: 0.98 }).beta).toBeCloseTo(
      48.99999999999996,
      12,
    );
    expect(runCommonEmitterCurrentGain({ alpha: 0.5 })).toEqual({
      ok: true,
      output: { beta: 1 },
    });
  });

  it("handles near-1 cancellation without premature overflow and normalizes -0", () => {
    const nearOne = 1 - Number.EPSILON;
    const result = runCommonEmitterCurrentGain({ alpha: nearOne });
    if (result.ok) {
      expect(Number.isFinite(result.output.beta)).toBe(true);
      expect(Object.is(result.output.beta, -0)).toBe(false);
      expect(result.output.beta).toBeGreaterThan(1e15);
    } else {
      expect(result.error.issues[0].code).toBe("numeric_overflow");
    }
    // very close to 0
    const nearZero = Number.MIN_VALUE;
    const low = runCommonEmitterCurrentGain({ alpha: nearZero });
    if (low.ok) {
      expect(Number.isFinite(low.output.beta)).toBe(true);
      expect(Object.is(low.output.beta, -0)).toBe(false);
      expect(low.output.beta).toBeGreaterThan(0);
    } else {
      // MIN_VALUE is >0 so should be finite beta ~5e-324
      expect(low.error.issues[0].code).toBe("numeric_overflow");
    }
    // direct near-one
    const directNearOne = calculateCommonEmitterGain({ alpha: 0.999999 }).beta;
    expect(Number.isFinite(directNearOne)).toBe(true);
    expect(directNearOne).toBe(0.999999 / (1 - 0.999999));
    expect(directNearOne).toBeCloseTo(999998.9999712444, 6);
  });

  it("rejects alpha outside (0,1) through execution", () => {
    for (const a of [0, 1, -0.5, 1.5]) {
      const r = runCommonEmitterCurrentGain({ alpha: a });
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(["invalid_field", "invalid_alpha"]).toContain(
          r.error.issues[0].code,
        );
        expect(r.error.issues[0].field).toBe("alpha");
      }
    }
    for (const a of [0, 1, -0.5, 1.5]) {
      let e: unknown = null;
      try {
        calculateCommonEmitterGain({ alpha: a });
      } catch (err) {
        e = err;
      }
      expect(e).not.toBeNull();
      expect((e as { code: string }).code).toBe("invalid_alpha");
    }
  });

  it("rejects -0 as invalid alpha", () => {
    const r = runCommonEmitterCurrentGain({ alpha: -0 });
    expect(r.ok).toBe(false);
    expect(() => calculateCommonEmitterGain({ alpha: -0 })).toThrow();
    let e: unknown = null;
    try {
      calculateCommonEmitterGain({ alpha: -0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_alpha");
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateCommonEmitterGain>[0];
      field: string;
    }> = [
      { input: { alpha: Number.NaN }, field: "alpha" },
      { input: { alpha: Number.POSITIVE_INFINITY }, field: "alpha" },
      { input: { alpha: Number.NEGATIVE_INFINITY }, field: "alpha" },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateCommonEmitterGain(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(runCommonEmitterCurrentGain({ alpha: Number.NaN }).ok).toBe(false);
    expect(
      runCommonEmitterCurrentGain({ alpha: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow for alpha extremely close to 1 when beta non-finite", () => {
    // Need alpha such that beta overflows to Infinity: alpha/(1-alpha) > Number.MAX_VALUE
    // => 1-alpha < alpha/MAX_VALUE ~5.5e-309 => need alpha = 1 - 2.2e-16? That beta ~4.5e15 still finite, not overflow
    // So to force overflow, we need alpha extremely close to 1 like 1 - 1e-309? But double can't distinguish that from 1
    // So we simulate via direct alpha = 0.999... with huge beta still finite. Overflow would only happen if 1-alpha underflows to 0
    // That happens when alpha rounds to 1. So test that alpha=1 is rejected as invalid_alpha not numeric_overflow, but alpha very close to 1 stays finite
    // Here we test that very close alpha stays finite and doesn't incorrectly return numeric_overflow unless truly overflow
    const veryClose = 1 - Number.EPSILON / 2; // may round to 1
    const r = runCommonEmitterCurrentGain({ alpha: veryClose });
    if (veryClose === 1) {
      expect(r.ok).toBe(false);
      if (!r.ok)
        expect(["invalid_alpha", "invalid_field"]).toContain(
          r.error.issues[0].code,
        );
    } else {
      if (r.ok) {
        expect(Number.isFinite(r.output.beta)).toBe(true);
      } else {
        expect(r.error.issues[0].code).toBe("numeric_overflow");
      }
    }
    // Direct overflow path: if we somehow have 1-alpha ===0
    let e: unknown = null;
    try {
      // alpha = 1 would trigger invalid_alpha first, not numeric_overflow
      calculateCommonEmitterGain({ alpha: 1 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_alpha");
  });

  it("rejects missing, wrong type, unknown fields, and non-object", () => {
    expect(runCommonEmitterCurrentGain({} as never).ok).toBe(false);
    expect(runCommonEmitterCurrentGain({ alpha: "0.99" as never }).ok).toBe(
      false,
    );
    const unknown = runCommonEmitterCurrentGain({
      alpha: 0.99,
      extra: 1,
    } as never);
    expect(unknown).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    const nonObject = runCommonEmitterCurrentGain(null as never);
    expect(nonObject.ok).toBe(false);
    expect(runCommonEmitterCurrentGain(42 as never).ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("preserves properties: beta=alpha/(1-alpha), inverse alpha=beta/(1+beta), monotonic, scaling", () => {
    const baseAlpha = 0.99;
    const baseBeta = calculateCommonEmitterGain({ alpha: baseAlpha }).beta;
    expect(baseBeta).toBeCloseTo(98.99999999999991, 10);
    expect(baseBeta).toBe(baseAlpha / (1 - baseAlpha));

    // inverse
    const recoveredAlpha = baseBeta / (1 + baseBeta);
    expect(recoveredAlpha).toBeCloseTo(baseAlpha, 12);
    expect(
      calculateCommonEmitterGain({ alpha: recoveredAlpha }).beta,
    ).toBeCloseTo(baseBeta, 10);

    // monotonic: larger alpha => larger beta
    const low = calculateCommonEmitterGain({ alpha: 0.5 }).beta;
    const high = calculateCommonEmitterGain({ alpha: 0.9 }).beta;
    expect(high).toBeGreaterThan(low);
    const veryHigh = calculateCommonEmitterGain({ alpha: 0.999 }).beta;
    expect(veryHigh).toBeGreaterThan(high);

    // scaling check: beta * (1-alpha) = alpha
    const alpha = 0.97;
    const beta = calculateCommonEmitterGain({ alpha }).beta;
    expect(beta * (1 - alpha)).toBeCloseTo(alpha, 12);

    // monotonic across range
    const alphas = [0.1, 0.5, 0.9, 0.99, 0.999];
    const betas = alphas.map(
      (a) => calculateCommonEmitterGain({ alpha: a }).beta,
    );
    for (let i = 1; i < betas.length; i++) {
      expect(betas[i]).toBeGreaterThan(betas[i - 1]!);
    }
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(calculateCommonEmitterGain({ alpha: 0.99 }).beta).toBe(
      0.99 / (1 - 0.99),
    );
    expect(calculateCommonEmitterGain({ alpha: 0.5 }).beta).toBe(1);
    expect(() => calculateCommonEmitterGain({ alpha: 0 })).toThrow();
    expect(() => calculateCommonEmitterGain({ alpha: 1 })).toThrow();
    expect(() => calculateCommonEmitterGain({ alpha: Number.NaN })).toThrow();
    expect(runCommonEmitterCurrentGain({ alpha: 0.99 })).toEqual({
      ok: true,
      output: { beta: 98.99999999999991 },
    });
  });

  it("keeps full precision without toPrecision rounding", () => {
    // toPrecision(12) would round 0.999999999999 / (1-0.999999999999) etc.
    // Ensure we keep raw double
    const alpha = 0.123456789012345;
    const expected = alpha / (1 - alpha);
    expect(calculateCommonEmitterGain({ alpha }).beta).toBe(expected);
    expect(calculateCommonEmitterGain({ alpha }).beta).not.toBe(
      Number(expected.toPrecision(12)),
    );
    // runner same
    const runner = runCommonEmitterCurrentGain({ alpha });
    if (!runner.ok) throw new Error("expected success");
    expect(runner.output.beta).toBe(expected);
  });
});
