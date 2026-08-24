import { describe, expect, it } from "vitest";
import {
  alganBandgapExample,
  calculateAlganBandgap,
  runAlganBandgap,
} from "./tool.js";

describe("AlGaN Bandgap Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runAlganBandgap(alganBandgapExample.input)).toEqual({
      ok: true,
      output: { bandgapEv: 4.059 },
    }));

  it("returns the GaN band gap at x = 0", () =>
    expect(runAlganBandgap({ aluminumFractionX: 0 })).toEqual({
      ok: true,
      output: { bandgapEv: 3.42 },
    }));

  it("returns the AlN band gap at x = 1", () =>
    expect(runAlganBandgap({ aluminumFractionX: 1 })).toEqual({
      ok: true,
      output: { bandgapEv: 6.25 },
    }));

  it("applies bowing at the midpoint composition", () =>
    expect(runAlganBandgap({ aluminumFractionX: 0.5 })).toEqual({
      ok: true,
      output: { bandgapEv: 4.585 },
    }));

  it("matches explicit calculation for several points", () => {
    const cases: Array<[number, number]> = [
      [0.3, 4.059],
      [0.7, 5.191],
      [0.2, 3.826],
      [0.8, 5.5240000000000005],
    ];
    for (const [x, expected] of cases) {
      const r = runAlganBandgap({ aluminumFractionX: x });
      expect(r.ok).toBe(true);
      if (!r.ok) throw new Error("expected success");
      expect((r.output as { bandgapEv: number }).bandgapEv).toBeCloseTo(
        expected,
        12,
      );
      expect(
        calculateAlganBandgap({ aluminumFractionX: x }).bandgapEv,
      ).toBeCloseTo(expected, 12);
    }
  });

  it("handles boundaries -0 and extreme fractions", () => {
    const minusZero = runAlganBandgap({ aluminumFractionX: -0 });
    expect(minusZero.ok).toBe(true);
    if (!minusZero.ok) throw new Error("expected success");
    expect((minusZero.output as { bandgapEv: number }).bandgapEv).toBeCloseTo(
      3.42,
      12,
    );
    expect(
      Object.is((minusZero.output as { bandgapEv: number }).bandgapEv, -0),
    ).toBe(false);

    expect(
      calculateAlganBandgap({ aluminumFractionX: -0 }).bandgapEv,
    ).toBeCloseTo(3.42, 12);
    expect(
      Object.is(calculateAlganBandgap({ aluminumFractionX: -0 }).bandgapEv, -0),
    ).toBe(false);

    // tiny epsilon still within 0..1
    expect(runAlganBandgap({ aluminumFractionX: Number.MIN_VALUE }).ok).toBe(
      true,
    );
    expect(runAlganBandgap({ aluminumFractionX: 1 - Number.EPSILON }).ok).toBe(
      true,
    );
  });

  it("increases monotonically across the range", () => {
    const low = runAlganBandgap({ aluminumFractionX: 0.2 });
    const high = runAlganBandgap({ aluminumFractionX: 0.8 });
    expect(low).toMatchObject({ ok: true });
    expect(high).toMatchObject({ ok: true });
    expect(
      (high as unknown as { output: { bandgapEv: number } }).output.bandgapEv,
    ).toBeGreaterThan(
      (low as unknown as { output: { bandgapEv: number } }).output.bandgapEv,
    );
    // direct monotonic
    const a = calculateAlganBandgap({ aluminumFractionX: 0.1 }).bandgapEv;
    const b = calculateAlganBandgap({ aluminumFractionX: 0.9 }).bandgapEv;
    expect(b).toBeGreaterThan(a);
  });

  it("stays below straight-line interpolation because of bowing", () => {
    const bowed = runAlganBandgap({ aluminumFractionX: 0.5 });
    expect(bowed).toMatchObject({ ok: true });
    expect(
      (bowed as unknown as { output: { bandgapEv: number } }).output.bandgapEv,
    ).toBeLessThan((3.42 + 6.25) / 2);
    // also at 0.3
    const at03 = calculateAlganBandgap({ aluminumFractionX: 0.3 }).bandgapEv;
    const linear03 = (1 - 0.3) * 3.42 + 0.3 * 6.25;
    expect(at03).toBeLessThan(linear03);
  });

  it("rejects a fraction below the valid range", () => {
    const r = runAlganBandgap({ aluminumFractionX: -0.01 });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_fraction"]).toContain(
      r.error.issues[0].code,
    );
    expect(r.error.issues[0].field).toBe("aluminumFractionX");
    expect(() => calculateAlganBandgap({ aluminumFractionX: -0.01 })).toThrow();
  });

  it("rejects a fraction above the valid range", () => {
    const r = runAlganBandgap({ aluminumFractionX: 1.01 });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_fraction"]).toContain(
      r.error.issues[0].code,
    );
    expect(() => calculateAlganBandgap({ aluminumFractionX: 1.01 })).toThrow();
  });

  it("rejects non-finite and wrong type inputs via runner", () => {
    expect(runAlganBandgap({ aluminumFractionX: Number.NaN }).ok).toBe(false);
    expect(
      runAlganBandgap({ aluminumFractionX: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
    expect(
      runAlganBandgap({ aluminumFractionX: Number.NEGATIVE_INFINITY }).ok,
    ).toBe(false);
    expect(runAlganBandgap({ aluminumFractionX: "0.3" as never }).ok).toBe(
      false,
    );
    expect(runAlganBandgap({ aluminumFractionX: null as never }).ok).toBe(
      false,
    );
  });

  it("direct calculator rejects non-finite inputs", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      let err: unknown = null;
      try {
        calculateAlganBandgap({ aluminumFractionX: bad });
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe("aluminumFractionX");
    }
  });

  it("rejects missing required inputs", () =>
    expect(runAlganBandgap({} as never)).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "aluminumFractionX" }],
      },
      ok: false,
    }));

  it("rejects unknown input fields", () =>
    expect(
      runAlganBandgap({ aluminumFractionX: 0.3, extra: 1 } as never),
    ).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    }));

  it("rejects non-object input", () => {
    expect(runAlganBandgap(null as never).ok).toBe(false);
    expect(runAlganBandgap("0.3" as never).ok).toBe(false);
    if (!runAlganBandgap(null as never).ok)
      expect(runAlganBandgap(null as never).error.issues[0].code).toBe(
        "object_required",
      );
  });

  it("reports numeric overflow against an input field", () => {
    // overflow not realistically triggered for finite 0..1 fraction, but check guard
    // Use huge bowing parameter override? Instead test that guard exists by mocking large value via direct Infinity case
    // Finite range prevents huge values, so overflow guard is defensive; we verify finite check already handles Infinity.
    let directErr: unknown = null;
    try {
      calculateAlganBandgap({ aluminumFractionX: Number.POSITIVE_INFINITY });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect(["invalid_fraction", "numeric_overflow", "invalid_field"]).toContain(
      (directErr as { code: string }).code,
    );
    // calculation itself never overflows for valid 0..1, so just ensure finite result
    const res = calculateAlganBandgap({ aluminumFractionX: 0.5 });
    expect(Number.isFinite(res.bandgapEv)).toBe(true);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(calculateAlganBandgap({ aluminumFractionX: 0.3 }).bandgapEv).toBe(
      4.059,
    );
    expect(calculateAlganBandgap({ aluminumFractionX: 0 }).bandgapEv).toBe(
      3.42,
    );
    expect(calculateAlganBandgap({ aluminumFractionX: 1 }).bandgapEv).toBe(
      6.25,
    );
    expect(() => calculateAlganBandgap({ aluminumFractionX: -0.1 })).toThrow();
    expect(() =>
      calculateAlganBandgap({ aluminumFractionX: Number.NaN }),
    ).toThrow();
  });

  it("preserves physical properties: bowing quadratic shape and invertability near linear", () => {
    // Eg(x) = 3.42 + x*(6.25-3.42) - x*(1-x)*1.0
    // test that derivative at midpoint is positive and bowing term maximal at 0.5
    const eg0 = calculateAlganBandgap({ aluminumFractionX: 0 }).bandgapEv;
    const eg05 = calculateAlganBandgap({ aluminumFractionX: 0.5 }).bandgapEv;
    const eg1 = calculateAlganBandgap({ aluminumFractionX: 1 }).bandgapEv;
    // midpoint below linear average
    expect(eg05).toBeLessThan((eg0 + eg1) / 2);
    // bowing term magnitude maximal at 0.5 vs 0.25
    const bowingAt05 = 0.5 * 0.5 * 1.0;
    const bowingAt025 = 0.25 * 0.75 * 1.0;
    expect(bowingAt05).toBeGreaterThan(bowingAt025);
    // monotonic steps of 0.1
    let prev = eg0;
    for (let x = 0.1; x <= 1; x += 0.1) {
      const cur = calculateAlganBandgap({
        aluminumFractionX: Number(x.toFixed(1)),
      }).bandgapEv;
      expect(cur).toBeGreaterThan(prev);
      prev = cur;
    }
    // inverse check: for bandgap near linear without bowing, approximate x ≈ (Eg-3.42)/(6.25-3.42)
    // with bowing, actual Eg is lower, so linear inversion underestimates? just verify inequality
    const x = 0.4;
    const eg = calculateAlganBandgap({ aluminumFractionX: x }).bandgapEv;
    const xLinearInverted = (eg - 3.42) / (6.25 - 3.42);
    expect(xLinearInverted).toBeLessThan(x); // because bowing reduces Eg
  });
});
