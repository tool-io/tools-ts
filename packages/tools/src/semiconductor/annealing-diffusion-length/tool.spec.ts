import { describe, expect, it } from "vitest";
import {
  calculateDiffusionLength,
  diffusionLengthExample,
  runDiffusionLength,
} from "./tool.js";

describe("Diffusion Length Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiffusionLength(diffusionLengthExample.input)).toEqual({
      ok: true,
      output: diffusionLengthExample.output,
    });
  });

  it("returns zero length for a zero-hour anneal and normalizes -0", () => {
    expect(
      runDiffusionLength({ diffusivityNm2PerHour: 0.25, annealHours: 0 }),
    ).toEqual({ ok: true, output: { diffusionLengthNm: 0 } });
    const minusZero = runDiffusionLength({
      diffusivityNm2PerHour: 0.25,
      annealHours: -0,
    });
    expect(minusZero.ok).toBe(true);
    if (!minusZero.ok) throw new Error("expected success");
    expect(
      (minusZero.output as { diffusionLengthNm: number }).diffusionLengthNm,
    ).toBe(0);
    expect(
      Object.is(
        (minusZero.output as { diffusionLengthNm: number }).diffusionLengthNm,
        -0,
      ),
    ).toBe(false);

    expect(
      calculateDiffusionLength({ diffusivityNm2PerHour: 0.25, annealHours: 0 })
        .diffusionLengthNm,
    ).toBe(0);
    expect(
      Object.is(
        calculateDiffusionLength({
          diffusivityNm2PerHour: 0.25,
          annealHours: -0,
        }).diffusionLengthNm,
        -0,
      ),
    ).toBe(false);
  });

  it("doubles the length when the anneal time quadruples", () => {
    expect(
      runDiffusionLength({ diffusivityNm2PerHour: 0.25, annealHours: 16 }),
    ).toEqual({ ok: true, output: { diffusionLengthNm: 2 } });
    expect(
      calculateDiffusionLength({ diffusivityNm2PerHour: 0.25, annealHours: 16 })
        .diffusionLengthNm,
    ).toBe(2);
  });

  it("balances fractional diffusivity and time products", () => {
    expect(
      runDiffusionLength({ diffusivityNm2PerHour: 2, annealHours: 0.5 }),
    ).toEqual({ ok: true, output: { diffusionLengthNm: 1 } });
  });

  it("computes fractional lengths exactly", () => {
    expect(
      runDiffusionLength({ diffusivityNm2PerHour: 0.04, annealHours: 9 }),
    ).toEqual({ ok: true, output: { diffusionLengthNm: 0.6 } });
  });

  it("grows with longer anneals at fixed diffusivity", () => {
    const short = runDiffusionLength({
      diffusivityNm2PerHour: 0.25,
      annealHours: 1,
    });
    const long = runDiffusionLength({
      diffusivityNm2PerHour: 0.25,
      annealHours: 9,
    });
    if (!short.ok || !long.ok) throw new Error("Expected success results.");
    expect(
      (long.output as { diffusionLengthNm: number }).diffusionLengthNm,
    ).toBeGreaterThan(
      (short.output as { diffusionLengthNm: number }).diffusionLengthNm,
    );
    expect(
      calculateDiffusionLength({ diffusivityNm2PerHour: 0.25, annealHours: 9 })
        .diffusionLengthNm,
    ).toBeGreaterThan(
      calculateDiffusionLength({ diffusivityNm2PerHour: 0.25, annealHours: 1 })
        .diffusionLengthNm,
    );
  });

  it("rejects a zero diffusivity", () => {
    const result = runDiffusionLength({
      diffusivityNm2PerHour: 0,
      annealHours: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(["invalid_field", "degenerate_input"]).toContain(
        result.error.issues[0].code,
      );
    let e: unknown = null;
    try {
      calculateDiffusionLength({ diffusivityNm2PerHour: 0, annealHours: 4 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("degenerate_input");
  });

  it("rejects negative diffusivity through schema validation", () => {
    const result = runDiffusionLength({
      diffusivityNm2PerHour: -0.25,
      annealHours: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(["invalid_field", "degenerate_input"]).toContain(
        result.error.issues[0].code,
      );
    expect(() =>
      calculateDiffusionLength({
        diffusivityNm2PerHour: -0.25,
        annealHours: 4,
      }),
    ).toThrow();
  });

  it("rejects negative anneal durations through schema validation", () => {
    const result = runDiffusionLength({
      diffusivityNm2PerHour: 0.25,
      annealHours: -4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(["invalid_field", "invalid_anneal_time"]).toContain(
        result.error.issues[0].code,
      );
    expect(() =>
      calculateDiffusionLength({
        diffusivityNm2PerHour: 0.25,
        annealHours: -4,
      }),
    ).toThrow();
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDiffusionLength({ diffusivityNm2PerHour: bad, annealHours: 4 }).ok,
      ).toBe(false);
      expect(
        runDiffusionLength({ diffusivityNm2PerHour: 0.25, annealHours: bad })
          .ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDiffusionLength>[0];
      field: string;
    }> = [
      {
        input: { diffusivityNm2PerHour: Number.NaN, annealHours: 4 },
        field: "diffusivityNm2PerHour",
      },
      {
        input: {
          diffusivityNm2PerHour: Number.POSITIVE_INFINITY,
          annealHours: 4,
        },
        field: "diffusivityNm2PerHour",
      },
      {
        input: {
          diffusivityNm2PerHour: Number.NEGATIVE_INFINITY,
          annealHours: 4,
        },
        field: "diffusivityNm2PerHour",
      },
      {
        input: { diffusivityNm2PerHour: 0.25, annealHours: Number.NaN },
        field: "annealHours",
      },
      {
        input: {
          diffusivityNm2PerHour: 0.25,
          annealHours: Number.POSITIVE_INFINITY,
        },
        field: "annealHours",
      },
      {
        input: {
          diffusivityNm2PerHour: 0.25,
          annealHours: Number.NEGATIVE_INFINITY,
        },
        field: "annealHours",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDiffusionLength(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects missing required inputs, wrong type, unknown fields, and non-object", () => {
    const missing = runDiffusionLength({} as never);
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runDiffusionLength({
        diffusivityNm2PerHour: "fast" as never,
        annealHours: 4,
      }).ok,
    ).toBe(false);
    const unknown = runDiffusionLength({
      diffusivityNm2PerHour: 0.25,
      annealHours: 4,
      temperatureC: 1100,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
    expect(runDiffusionLength(true as never).ok).toBe(false);
    expect(runDiffusionLength(null as never).ok).toBe(false);
    if (!runDiffusionLength(null as never).ok)
      expect(runDiffusionLength(null as never).error.issues[0].code).toBe(
        "object_required",
      );
  });

  it("avoids overflow in D·t when the square root is finite", () => {
    // Direct product D*t overflows to Infinity, but sqrt(D)*sqrt(t) stays finite.
    const large = calculateDiffusionLength({
      diffusivityNm2PerHour: 1e200,
      annealHours: 1e200,
    }).diffusionLengthNm;
    expect(large).toBe(1e200);
    expect(Number.isFinite(large)).toBe(true);

    const viaRunner = runDiffusionLength({
      diffusivityNm2PerHour: 1e200,
      annealHours: 1e200,
    });
    expect(viaRunner.ok).toBe(true);
    if (!viaRunner.ok) throw new Error("expected success");
    expect(
      (viaRunner.output as { diffusionLengthNm: number }).diffusionLengthNm,
    ).toBe(1e200);

    // Max value product still finite via fallback
    const maxCase = calculateDiffusionLength({
      diffusivityNm2PerHour: Number.MAX_VALUE,
      annealHours: Number.MAX_VALUE,
    }).diffusionLengthNm;
    expect(Number.isFinite(maxCase)).toBe(true);
    expect(maxCase).toBeCloseTo(1.7976931348623155e308, 0);
  });

  it("handles very small diffusivity and time without -0 or NaN, and handles underflow", () => {
    const tiny = Number.MIN_VALUE;
    const r = runDiffusionLength({
      diffusivityNm2PerHour: tiny,
      annealHours: 1e-308,
    });
    if (r.ok) {
      const v = (r.output as { diffusionLengthNm: number }).diffusionLengthNm;
      expect(Number.isFinite(v)).toBe(true);
      expect(Object.is(v, -0)).toBe(false);
      expect(v).toBeGreaterThanOrEqual(0);
    } else {
      expect(r.error.issues[0].code).toBe("numeric_underflow");
    }
    const underflowResistant = calculateDiffusionLength({
      diffusivityNm2PerHour: 1e-308,
      annealHours: 1e-308,
    });
    expect(underflowResistant.diffusionLengthNm).toBe(1e-308);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateDiffusionLength(diffusionLengthExample.input).diffusionLengthNm,
    ).toBe(1);
    expect(
      calculateDiffusionLength({ diffusivityNm2PerHour: 0.04, annealHours: 9 })
        .diffusionLengthNm,
    ).toBeCloseTo(0.6, 12);
    expect(() =>
      calculateDiffusionLength({ diffusivityNm2PerHour: 0, annealHours: 4 }),
    ).toThrow();
    expect(() =>
      calculateDiffusionLength({
        diffusivityNm2PerHour: Number.NaN,
        annealHours: 4,
      }),
    ).toThrow();
  });

  it("preserves properties: L = sqrt(D·t), scaling, inverse, and monotonic", () => {
    // sqrt product property
    const base = calculateDiffusionLength({
      diffusivityNm2PerHour: 0.25,
      annealHours: 4,
    }).diffusionLengthNm; //1
    expect(base * base).toBeCloseTo(0.25 * 4, 12);

    // quadrupling time doubles length
    const quadTime = calculateDiffusionLength({
      diffusivityNm2PerHour: 0.25,
      annealHours: 16,
    }).diffusionLengthNm;
    expect(quadTime).toBeCloseTo(base * 2, 12);

    // quadrupling diffusivity also doubles length
    const quadD = calculateDiffusionLength({
      diffusivityNm2PerHour: 1,
      annealHours: 4,
    }).diffusionLengthNm;
    expect(quadD).toBeCloseTo(base * 2, 12);

    // inverse: D = L^2 / t
    const L = 2;
    const t = 9;
    const D = 0.4444444444444444; // L^2/t
    const recalculated = calculateDiffusionLength({
      diffusivityNm2PerHour: D,
      annealHours: t,
    }).diffusionLengthNm;
    expect(recalculated).toBeCloseTo(L, 12);
    // recover diffusivity
    const recoveredD = (recalculated * recalculated) / t;
    expect(recoveredD).toBeCloseTo(D, 12);

    // monotonic in both
    const low = calculateDiffusionLength({
      diffusivityNm2PerHour: 0.1,
      annealHours: 1,
    }).diffusionLengthNm;
    const highT = calculateDiffusionLength({
      diffusivityNm2PerHour: 0.1,
      annealHours: 10,
    }).diffusionLengthNm;
    const highD = calculateDiffusionLength({
      diffusivityNm2PerHour: 1,
      annealHours: 1,
    }).diffusionLengthNm;
    expect(highT).toBeGreaterThan(low);
    expect(highD).toBeGreaterThan(low);

    // scaling both D and t by same factor scales L by same factor (sqrt(f*f)=f)
    const scaled = calculateDiffusionLength({
      diffusivityNm2PerHour: 1,
      annealHours: 16,
    }).diffusionLengthNm;
    expect(scaled).toBeCloseTo(4, 12);
  });
});
