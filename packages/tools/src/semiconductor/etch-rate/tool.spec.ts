import { describe, expect, it } from "vitest";
import { calculateEtchRate, etchRateExample, runEtchRate } from "./tool.js";

describe("etch rate calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runEtchRate(etchRateExample.input)).toEqual({
      ok: true,
      output: etchRateExample.output,
    });
  });

  it("maps 300 nm in 2 minutes to exactly 150 nm/min", () => {
    expect(
      runEtchRate({ etchTimeMinutes: 2, removedThicknessNm: 300 }),
    ).toEqual({ ok: true, output: { etchRateNmPerMinute: 150 } });
  });

  it("allows zero removed thickness as exactly 0 nm/min and normalizes negative zero", () => {
    expect(runEtchRate({ etchTimeMinutes: 2, removedThicknessNm: 0 })).toEqual({
      ok: true,
      output: { etchRateNmPerMinute: 0 },
    });
    const viaRunner = runEtchRate({
      etchTimeMinutes: 2,
      removedThicknessNm: -0,
    });
    expect(viaRunner.ok).toBe(true);
    if (!viaRunner.ok) throw new Error("expected success");
    expect(
      (viaRunner.output as { etchRateNmPerMinute: number }).etchRateNmPerMinute,
    ).toBe(0);
    expect(
      Object.is(
        (viaRunner.output as { etchRateNmPerMinute: number })
          .etchRateNmPerMinute,
        -0,
      ),
    ).toBe(false);
    expect(
      1 /
        (viaRunner.output as { etchRateNmPerMinute: number })
          .etchRateNmPerMinute,
    ).toBe(Infinity);

    expect(
      calculateEtchRate({ etchTimeMinutes: 2, removedThicknessNm: 0 })
        .etchRateNmPerMinute,
    ).toBe(0);
    expect(
      Object.is(
        calculateEtchRate({ etchTimeMinutes: 2, removedThicknessNm: -0 })
          .etchRateNmPerMinute,
        -0,
      ),
    ).toBe(false);
  });

  it("rejects negative removed thickness", () => {
    const runnerNeg = runEtchRate({
      etchTimeMinutes: 2,
      removedThicknessNm: -50,
    });
    expect(runnerNeg.ok).toBe(false);
    if (runnerNeg.ok) throw new Error("expected failure");
    // schema-aligned rejection: invalid_field due to minimum 0
    expect(["invalid_field", "invalid_removed_thickness"]).toContain(
      runnerNeg.error.issues[0].code,
    );
    expect(runnerNeg.error.issues[0].field).toBe("removedThicknessNm");

    // direct calculator exercises explicit finite/negative check
    let directError: unknown = null;
    try {
      calculateEtchRate({ etchTimeMinutes: 2, removedThicknessNm: -50 });
    } catch (e) {
      directError = e;
    }
    expect(directError).not.toBeNull();
    expect((directError as { code: string }).code).toBe(
      "invalid_removed_thickness",
    );
    expect((directError as { field: string }).field).toBe("removedThicknessNm");
  });

  it("rejects zero and negative etch time", () => {
    for (const badTime of [0, -2, -0.0001]) {
      const r = runEtchRate({
        etchTimeMinutes: badTime,
        removedThicknessNm: 300,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_etch_time"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("etchTimeMinutes");
    }
    // direct
    for (const badTime of [0, -2]) {
      let e: unknown = null;
      try {
        calculateEtchRate({
          etchTimeMinutes: badTime,
          removedThicknessNm: 300,
        });
      } catch (err) {
        e = err;
      }
      expect(e).not.toBeNull();
      expect((e as { code: string }).code).toBe("invalid_etch_time");
    }
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: { etchTimeMinutes: number; removedThicknessNm: number };
      field: string;
    }> = [
      {
        input: { etchTimeMinutes: Number.NaN, removedThicknessNm: 300 },
        field: "etchTimeMinutes",
      },
      {
        input: {
          etchTimeMinutes: Number.POSITIVE_INFINITY,
          removedThicknessNm: 300,
        },
        field: "etchTimeMinutes",
      },
      {
        input: {
          etchTimeMinutes: Number.NEGATIVE_INFINITY,
          removedThicknessNm: 300,
        },
        field: "etchTimeMinutes",
      },
      {
        input: { etchTimeMinutes: 2, removedThicknessNm: Number.NaN },
        field: "removedThicknessNm",
      },
      {
        input: {
          etchTimeMinutes: 2,
          removedThicknessNm: Number.POSITIVE_INFINITY,
        },
        field: "removedThicknessNm",
      },
      {
        input: {
          etchTimeMinutes: 2,
          removedThicknessNm: Number.NEGATIVE_INFINITY,
        },
        field: "removedThicknessNm",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateEtchRate(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    // runner also rejects via schema invalid_field
    expect(
      runEtchRate({ etchTimeMinutes: Number.NaN, removedThicknessNm: 300 }).ok,
    ).toBe(false);
    expect(
      runEtchRate({
        etchTimeMinutes: 2,
        removedThicknessNm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow against an input field", () => {
    // MAX_VALUE / MIN_VALUE overflows to Infinity
    let directErr: unknown = null;
    try {
      calculateEtchRate({
        etchTimeMinutes: Number.MIN_VALUE,
        removedThicknessNm: Number.MAX_VALUE,
      });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("numeric_range");
    expect((directErr as { field: string }).field).toBe("etchTimeMinutes");

    const runner = runEtchRate({
      etchTimeMinutes: Number.MIN_VALUE,
      removedThicknessNm: Number.MAX_VALUE,
    });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(runner.error.issues[0].code).toBe("numeric_range");
    expect(runner.error.issues[0].field).toBe("etchTimeMinutes");
  });

  it("handles very small positive time without producing -0 or NaN", () => {
    const tinyTime = Number.MIN_VALUE;
    const thickness = 1e-308; // small but finite
    const result = runEtchRate({
      etchTimeMinutes: tinyTime,
      removedThicknessNm: thickness,
    });
    // either finite or documented overflow
    if (result.ok) {
      const rate = (result.output as { etchRateNmPerMinute: number })
        .etchRateNmPerMinute;
      expect(Number.isFinite(rate)).toBe(true);
      expect(rate).toBeGreaterThanOrEqual(0);
      expect(Object.is(rate, -0)).toBe(false);
    } else {
      expect(result.error.issues[0].code).toBe("numeric_range");
    }
    // fractional still works
    expect(
      runEtchRate({ etchTimeMinutes: 0.5, removedThicknessNm: 0.25 }),
    ).toEqual({
      ok: true,
      output: { etchRateNmPerMinute: 0.5 },
    });
  });

  it("preserves properties: rate * time ≈ thickness, doubling thickness doubles rate, doubling time halves rate, scaling both preserves rate", () => {
    const base = { etchTimeMinutes: 2, removedThicknessNm: 300 };
    const baseRate = calculateEtchRate(base).etchRateNmPerMinute;
    expect(baseRate * base.etchTimeMinutes).toBeCloseTo(
      base.removedThicknessNm,
      12,
    );

    const doubledThickness = calculateEtchRate({
      etchTimeMinutes: 2,
      removedThicknessNm: 600,
    }).etchRateNmPerMinute;
    expect(doubledThickness).toBeCloseTo(baseRate * 2, 12);

    const doubledTime = calculateEtchRate({
      etchTimeMinutes: 4,
      removedThicknessNm: 300,
    }).etchRateNmPerMinute;
    expect(doubledTime).toBeCloseTo(baseRate / 2, 12);

    const scaled = calculateEtchRate({
      etchTimeMinutes: 6,
      removedThicknessNm: 900,
    }).etchRateNmPerMinute;
    expect(scaled).toBeCloseTo(baseRate, 12);

    // fractional property
    const frac = calculateEtchRate({
      etchTimeMinutes: 1.2,
      removedThicknessNm: 3.6,
    }).etchRateNmPerMinute;
    expect(frac).toBeCloseTo(3, 12);
  });

  it("rejects missing, non-numeric, and non-finite runner inputs", () => {
    const missing = runEtchRate({});
    expect(missing.ok).toBe(false);
    if (missing.ok) throw new Error("expected failure");
    expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runEtchRate({ etchTimeMinutes: "quick dip", removedThicknessNm: 300 }).ok,
    ).toBe(false);
    expect(
      runEtchRate({ etchTimeMinutes: Number.NaN, removedThicknessNm: 300 }).ok,
    ).toBe(false);
    expect(
      runEtchRate({
        etchTimeMinutes: 2,
        removedThicknessNm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("rejects unknown fields and non-object input", () => {
    const unknown = runEtchRate({
      etchTimeMinutes: 2,
      removedThicknessNm: 300,
      chemistry: "HF",
    });
    expect(unknown.ok).toBe(false);
    if (unknown.ok) throw new Error("expected failure");
    expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runEtchRate(undefined);
    expect(nonObject.ok).toBe(false);
    if (nonObject.ok) throw new Error("expected failure");
    expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateEtchRate({ etchTimeMinutes: 2, removedThicknessNm: 300 })
        .etchRateNmPerMinute,
    ).toBe(150);
    expect(
      calculateEtchRate({ etchTimeMinutes: 2, removedThicknessNm: 0 })
        .etchRateNmPerMinute,
    ).toBe(0);
    expect(() =>
      calculateEtchRate({ etchTimeMinutes: 0, removedThicknessNm: 300 }),
    ).toThrow();
    expect(() =>
      calculateEtchRate({
        etchTimeMinutes: Number.NaN,
        removedThicknessNm: 300,
      }),
    ).toThrow();
  });
});
