import { describe, expect, it } from "vitest";
import {
  bandgapTemperatureVarshniExample,
  calculateBandgapTemperatureVarshni,
  runBandgapTemperatureVarshni,
} from "./tool.js";

describe("Varshni Bandgap Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runBandgapTemperatureVarshni(bandgapTemperatureVarshniExample.input),
    ).toEqual({ ok: true, output: bandgapTemperatureVarshniExample.output }));

  it("defaults to silicon coefficients when omitted", () =>
    expect(runBandgapTemperatureVarshni({ tempK: 300 })).toEqual({
      ok: true,
      output: { bandgapEv: 1.1245192307692307 },
    }));

  it("evaluates gallium arsenide at 100 K", () =>
    expect(
      runBandgapTemperatureVarshni({
        alphaVarshni: 5.405e-4,
        betaVarshni: 204,
        egZeroEv: 1.519,
        tempK: 100,
      }),
    ).toEqual({ ok: true, output: { bandgapEv: 1.501220394736842 } }));

  it("evaluates direct calculator with defaults", () => {
    expect(
      calculateBandgapTemperatureVarshni({ tempK: 300 }).bandgapEv,
    ).toBeCloseTo(1.1245192307692307, 12);
    expect(
      calculateBandgapTemperatureVarshni({
        alphaVarshni: 5.405e-4,
        betaVarshni: 204,
        egZeroEv: 1.519,
        tempK: 100,
      }).bandgapEv,
    ).toBeCloseTo(1.501220394736842, 12);
  });

  it("narrows the bandgap as temperature rises (monotonic decreasing)", () => {
    const cold = runBandgapTemperatureVarshni({ tempK: 200 });
    const hot = runBandgapTemperatureVarshni({ tempK: 400 });
    if (!cold.ok || !hot.ok) throw new Error("expected success");
    expect(hot.output.bandgapEv as number).toBeLessThan(
      cold.output.bandgapEv as number,
    );
    // direct monotonic
    const c = calculateBandgapTemperatureVarshni({ tempK: 200 }).bandgapEv;
    const h = calculateBandgapTemperatureVarshni({ tempK: 400 }).bandgapEv;
    expect(h).toBeLessThan(c);
  });

  it("approaches the zero-kelvin bandgap for tiny temperatures", () => {
    const r = runBandgapTemperatureVarshni({ tempK: 1e-9 });
    expect(r).toMatchObject({
      ok: true,
      output: { bandgapEv: 1.17 },
    });
    // also direct
    expect(
      calculateBandgapTemperatureVarshni({ tempK: 1e-12 }).bandgapEv,
    ).toBeCloseTo(1.17, 12);
  });

  it("normalizes -0 output to 0 and stays finite for tiny temps", () => {
    const tiny = runBandgapTemperatureVarshni({ tempK: Number.MIN_VALUE });
    if (tiny.ok) {
      expect(Number.isFinite(tiny.output.bandgapEv)).toBe(true);
      expect(Object.is(tiny.output.bandgapEv, -0)).toBe(false);
    } else {
      expect(tiny.error.issues[0].code).toBe("numeric_overflow");
    }
    const directTiny = calculateBandgapTemperatureVarshni({
      tempK: Number.MIN_VALUE,
    });
    expect(Object.is(directTiny.bandgapEv, -0)).toBe(false);
    expect(Number.isFinite(directTiny.bandgapEv)).toBe(true);
  });

  it("rejects zero kelvin with a stable code", () => {
    const r = runBandgapTemperatureVarshni({
      ...bandgapTemperatureVarshniExample.input,
      tempK: 0,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.issues[0].field).toBe("tempK");
      expect(["invalid_field", "invalid_temperature"]).toContain(
        r.error.issues[0].code,
      );
    }
    let e: unknown = null;
    try {
      calculateBandgapTemperatureVarshni({ tempK: 0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_temperature");
  });

  it("rejects sub-zero temperatures with a stable code", () => {
    const r = runBandgapTemperatureVarshni({ tempK: -5 });
    expect(r).toMatchObject({
      error: { issues: [{ field: "tempK" }] },
      ok: false,
    });
    expect(() => calculateBandgapTemperatureVarshni({ tempK: -5 })).toThrow();
  });

  it("rejects -0 temperature", () => {
    const r = runBandgapTemperatureVarshni({ tempK: -0 });
    expect(r.ok).toBe(false);
    expect(() => calculateBandgapTemperatureVarshni({ tempK: -0 })).toThrow();
  });

  it("direct calculator rejects non-finite temperature", () => {
    const cases: Array<{
      input: Parameters<typeof calculateBandgapTemperatureVarshni>[0];
      field: string;
    }> = [
      { input: { tempK: Number.NaN }, field: "tempK" },
      { input: { tempK: Number.POSITIVE_INFINITY }, field: "tempK" },
      { input: { tempK: Number.NEGATIVE_INFINITY }, field: "tempK" },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateBandgapTemperatureVarshni(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(runBandgapTemperatureVarshni({ tempK: Number.NaN }).ok).toBe(false);
    expect(
      runBandgapTemperatureVarshni({ tempK: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("rejects invalid optional fields", () => {
    // egZeroEv <=0
    expect(runBandgapTemperatureVarshni({ tempK: 300, egZeroEv: 0 }).ok).toBe(
      false,
    );
    expect(runBandgapTemperatureVarshni({ tempK: 300, egZeroEv: -1 }).ok).toBe(
      false,
    );
    expect(
      runBandgapTemperatureVarshni({ tempK: 300, egZeroEv: Number.NaN }).ok,
    ).toBe(false);

    // alpha negative
    expect(
      runBandgapTemperatureVarshni({ tempK: 300, alphaVarshni: -1 }).ok,
    ).toBe(false);
    // beta <=0
    expect(
      runBandgapTemperatureVarshni({ tempK: 300, betaVarshni: 0 }).ok,
    ).toBe(false);
    expect(
      runBandgapTemperatureVarshni({ tempK: 300, betaVarshni: -10 }).ok,
    ).toBe(false);

    let e: unknown = null;
    try {
      calculateBandgapTemperatureVarshni({ tempK: 300, egZeroEv: 0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_egZeroEv");
    let e2: unknown = null;
    try {
      calculateBandgapTemperatureVarshni({ tempK: 300, alphaVarshni: -1 });
    } catch (err) {
      e2 = err;
    }
    expect((e2 as { field: string }).field).toBe("alphaVarshni");
    let e3: unknown = null;
    try {
      calculateBandgapTemperatureVarshni({ tempK: 300, betaVarshni: 0 });
    } catch (err) {
      e3 = err;
    }
    expect((e3 as { code: string }).code).toBe("invalid_betaVarshni");
  });

  it("evaluates extreme finite temperatures without overflowing T squared", () => {
    const direct = calculateBandgapTemperatureVarshni({
      tempK: Number.MAX_VALUE,
      alphaVarshni: 1,
      betaVarshni: 1,
      egZeroEv: 1,
    });
    expect(Number.isFinite(direct.bandgapEv)).toBe(true);
    const runner = runBandgapTemperatureVarshni({
      tempK: Number.MAX_VALUE,
      alphaVarshni: 1,
      betaVarshni: 1,
      egZeroEv: 1,
    });
    expect(runner.ok).toBe(true);

    const largeDenominator = calculateBandgapTemperatureVarshni({
      tempK: Number.MAX_VALUE,
      betaVarshni: Number.MAX_VALUE,
    });
    expect(Number.isFinite(largeDenominator.bandgapEv)).toBe(true);
  });

  it("handles underflow product that yields 0 as finite", () => {
    // very small temp still finite
    const under = calculateBandgapTemperatureVarshni({
      tempK: Number.MIN_VALUE,
    });
    expect(Number.isFinite(under.bandgapEv)).toBe(true);
    expect(under.bandgapEv).toBeCloseTo(1.17, 12);
  });

  it("rejects missing, wrong type, unknown fields, and non-object", () => {
    expect(runBandgapTemperatureVarshni({} as never).ok).toBe(false);
    expect(runBandgapTemperatureVarshni({ tempK: "300" as never }).ok).toBe(
      false,
    );
    const unknown = runBandgapTemperatureVarshni({
      ...bandgapTemperatureVarshniExample.input,
      extra: 1,
    } as never);
    expect(unknown).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    const nonObject = runBandgapTemperatureVarshni(null as never);
    expect(nonObject.ok).toBe(false);
    expect(runBandgapTemperatureVarshni(42 as never).ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("preserves properties: formula exact, monotonic, inverse via Eg0, scaling with alpha", () => {
    const eg0 = 1.17;
    const alpha = 4.73e-4;
    const beta = 636;
    const T = 300;
    const expected = eg0 - (alpha * T * T) / (T + beta);
    expect(
      calculateBandgapTemperatureVarshni({
        egZeroEv: eg0,
        alphaVarshni: alpha,
        betaVarshni: beta,
        tempK: T,
      }).bandgapEv,
    ).toBeCloseTo(expected, 12);

    // inverse: Eg0 = Eg(T) + alpha*T^2/(T+beta)
    const egt = calculateBandgapTemperatureVarshni({
      egZeroEv: eg0,
      alphaVarshni: alpha,
      betaVarshni: beta,
      tempK: T,
    }).bandgapEv;
    const recoveredEg0 = egt + (alpha * T * T) / (T + beta);
    expect(recoveredEg0).toBeCloseTo(eg0, 12);

    // larger alpha => smaller gap
    const lowAlpha = calculateBandgapTemperatureVarshni({
      alphaVarshni: 1e-4,
      tempK: 300,
    }).bandgapEv;
    const highAlpha = calculateBandgapTemperatureVarshni({
      alphaVarshni: 1e-3,
      tempK: 300,
    }).bandgapEv;
    expect(highAlpha).toBeLessThan(lowAlpha);

    // monotonic decreasing with T
    const t200 = calculateBandgapTemperatureVarshni({ tempK: 200 }).bandgapEv;
    const t400 = calculateBandgapTemperatureVarshni({ tempK: 400 }).bandgapEv;
    expect(t400).toBeLessThan(t200);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateBandgapTemperatureVarshni(bandgapTemperatureVarshniExample.input)
        .bandgapEv,
    ).toBe(bandgapTemperatureVarshniExample.output.bandgapEv);
    expect(() => calculateBandgapTemperatureVarshni({ tempK: 0 })).toThrow();
    expect(() =>
      calculateBandgapTemperatureVarshni({ tempK: Number.NaN }),
    ).toThrow();
    expect(runBandgapTemperatureVarshni({ tempK: 300 }).ok).toBe(true);
  });
});
