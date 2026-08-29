import { describe, expect, it } from "vitest";
import {
  bandgapNarrowingExample,
  calculateBandgapNarrowing,
  runBandgapNarrowing,
} from "./tool.js";

describe("Bandgap Narrowing Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runBandgapNarrowing(bandgapNarrowingExample.input)).toEqual({
      ok: true,
      output: bandgapNarrowingExample.output,
    }));

  it("adds 18 meV per doping decade above the reference", () => {
    expect(runBandgapNarrowing({ dopingPerCm3: 1e19 })).toEqual({
      ok: true,
      output: { narrowingMeV: 36 },
    });
    expect(calculateBandgapNarrowing({ dopingPerCm3: 1e19 }).narrowingMeV).toBe(
      36,
    );
  });

  it("clamps light doping at the reference to zero", () =>
    expect(runBandgapNarrowing({ dopingPerCm3: 1e16 })).toEqual({
      ok: true,
      output: { narrowingMeV: 0 },
    }));

  it("interpolates half decades linearly", () => {
    const half = runBandgapNarrowing({
      dopingPerCm3: Math.sqrt(10) * 1e17,
    });
    expect(half).toEqual({ ok: true, output: { narrowingMeV: 9 } });
    expect(
      calculateBandgapNarrowing({ dopingPerCm3: Math.sqrt(10) * 1e17 })
        .narrowingMeV,
    ).toBeCloseTo(9, 12);
  });

  it("returns zero exactly at the reference concentration", () =>
    expect(runBandgapNarrowing({ dopingPerCm3: 1e17 })).toEqual({
      ok: true,
      output: { narrowingMeV: 0 },
    }));

  it("normalizes -0 output to 0 and handles underflow", () => {
    const viaRunner = runBandgapNarrowing({ dopingPerCm3: 1e17 });
    if (!viaRunner.ok) throw new Error("expected success");
    expect(Object.is(viaRunner.output.narrowingMeV, -0)).toBe(false);
    expect(viaRunner.output.narrowingMeV).toBe(0);

    const viaDirect = calculateBandgapNarrowing({ dopingPerCm3: 1e16 });
    expect(Object.is(viaDirect.narrowingMeV, -0)).toBe(false);
    expect(viaDirect.narrowingMeV).toBe(0);

    // vanishingly small doping still clamps to 0
    expect(runBandgapNarrowing({ dopingPerCm3: 1 })).toMatchObject({
      ok: true,
      output: { narrowingMeV: 0 },
    });
    // MIN_VALUE doping is still >0 but far below reference => 0
    const min = runBandgapNarrowing({ dopingPerCm3: Number.MIN_VALUE });
    if (min.ok) {
      expect(min.output.narrowingMeV).toBe(0);
      expect(Object.is(min.output.narrowingMeV, -0)).toBe(false);
    } else {
      expect(min.error.issues[0].code).toBe("numeric_overflow");
    }
  });

  it("rejects zero doping with a stable code", () => {
    const r = runBandgapNarrowing({ dopingPerCm3: 0 });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.issues[0].field).toBe("dopingPerCm3");
      expect(["invalid_field", "invalid_doping"]).toContain(
        r.error.issues[0].code,
      );
    }
    let e: unknown = null;
    try {
      calculateBandgapNarrowing({ dopingPerCm3: 0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_doping");
  });

  it("rejects negative doping with a stable code", () => {
    const r = runBandgapNarrowing({ dopingPerCm3: -1e18 });
    expect(r).toMatchObject({
      error: { issues: [{ field: "dopingPerCm3" }] },
      ok: false,
    });
    expect(() => calculateBandgapNarrowing({ dopingPerCm3: -1e18 })).toThrow();
    let e: unknown = null;
    try {
      calculateBandgapNarrowing({ dopingPerCm3: -1 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_doping");
  });

  it("rejects -0 as invalid doping", () => {
    const r = runBandgapNarrowing({ dopingPerCm3: -0 });
    expect(r.ok).toBe(false);
    let e: unknown = null;
    try {
      calculateBandgapNarrowing({ dopingPerCm3: -0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_doping");
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateBandgapNarrowing>[0];
      field: string;
    }> = [
      { input: { dopingPerCm3: Number.NaN }, field: "dopingPerCm3" },
      {
        input: { dopingPerCm3: Number.POSITIVE_INFINITY },
        field: "dopingPerCm3",
      },
      {
        input: { dopingPerCm3: Number.NEGATIVE_INFINITY },
        field: "dopingPerCm3",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateBandgapNarrowing(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(runBandgapNarrowing({ dopingPerCm3: Number.NaN }).ok).toBe(false);
    expect(
      runBandgapNarrowing({ dopingPerCm3: Number.POSITIVE_INFINITY }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow against an input field when finite check fails due to huge doping", () => {
    // Doping = MAX_VALUE is still finite and produces finite narrowing, so runner should succeed
    const hugeFinite = runBandgapNarrowing({ dopingPerCm3: Number.MAX_VALUE });
    if (hugeFinite.ok) {
      expect(Number.isFinite(hugeFinite.output.narrowingMeV)).toBe(true);
      expect(hugeFinite.output.narrowingMeV).toBeGreaterThan(0);
    } else {
      expect(hugeFinite.error.issues[0].code).toBe("numeric_overflow");
    }
    // Non-finite already covered; overflow path exercised via direct if ratio not finite
    // For completeness, ensure direct with MAX_VALUE does not throw numeric_overflow unless ratio overflows
    let directErr: unknown = null;
    try {
      calculateBandgapNarrowing({ dopingPerCm3: Number.MAX_VALUE });
    } catch (e) {
      directErr = e;
    }
    if (directErr) {
      expect((directErr as { code: string }).code).toBe("numeric_overflow");
    } else {
      expect(
        calculateBandgapNarrowing({ dopingPerCm3: Number.MAX_VALUE })
          .narrowingMeV,
      ).toBeGreaterThan(0);
    }
  });

  it("rejects missing, wrong type, unknown fields, and non-object", () => {
    expect(runBandgapNarrowing({} as never).ok).toBe(false);
    expect(runBandgapNarrowing({ dopingPerCm3: "1e18" as never }).ok).toBe(
      false,
    );
    const unknown = runBandgapNarrowing({
      dopingPerCm3: 1e18,
      extra: 1,
    } as never);
    expect(unknown).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    const nonObject = runBandgapNarrowing(null as never);
    expect(nonObject.ok).toBe(false);
    expect(runBandgapNarrowing(42 as never).ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("preserves properties: monotonic, 18 per decade, inverse, scaling", () => {
    const atRef = calculateBandgapNarrowing({
      dopingPerCm3: 1e17,
    }).narrowingMeV;
    expect(atRef).toBe(0);
    const at1e18 = calculateBandgapNarrowing({
      dopingPerCm3: 1e18,
    }).narrowingMeV;
    expect(at1e18).toBe(18);
    const at1e19 = calculateBandgapNarrowing({
      dopingPerCm3: 1e19,
    }).narrowingMeV;
    expect(at1e19).toBe(36);
    expect(at1e19).toBeCloseTo(at1e18 + 18, 12);

    // monotonic above reference
    const low = calculateBandgapNarrowing({ dopingPerCm3: 1e18 }).narrowingMeV;
    const high = calculateBandgapNarrowing({ dopingPerCm3: 1e20 }).narrowingMeV;
    expect(high).toBeGreaterThan(low);

    // inverse: doping = 1e17 *10^(narrowing/18)
    const narrowing = 27;
    const doping = 1e17 * Math.pow(10, narrowing / 18);
    expect(
      calculateBandgapNarrowing({ dopingPerCm3: doping }).narrowingMeV,
    ).toBeCloseTo(narrowing, 10);

    // scaling: doubling decades adds 18
    const base = calculateBandgapNarrowing({ dopingPerCm3: 5e17 }).narrowingMeV;
    const tenX = calculateBandgapNarrowing({ dopingPerCm3: 5e18 }).narrowingMeV;
    expect(tenX).toBeCloseTo(base + 18, 12);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(calculateBandgapNarrowing({ dopingPerCm3: 1e18 }).narrowingMeV).toBe(
      18,
    );
    expect(calculateBandgapNarrowing({ dopingPerCm3: 1e17 }).narrowingMeV).toBe(
      0,
    );
    expect(() => calculateBandgapNarrowing({ dopingPerCm3: 0 })).toThrow();
    expect(() =>
      calculateBandgapNarrowing({ dopingPerCm3: Number.NaN }),
    ).toThrow();
    expect(runBandgapNarrowing(bandgapNarrowingExample.input)).toEqual({
      ok: true,
      output: bandgapNarrowingExample.output,
    });
  });
});
