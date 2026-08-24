import { describe, expect, it } from "vitest";
import {
  calculateThreeDIcTsvKeepOutZone,
  runThreeDIcTsvKeepOutZone,
  threeDIcTsvKeepOutZoneExample,
} from "./tool.js";

describe("TSV Keep-Out Zone Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runThreeDIcTsvKeepOutZone(threeDIcTsvKeepOutZoneExample.input),
    ).toEqual({ ok: true, output: { keepOutUm: 10 } }));

  it("defaults the keep-out ratio to two", () =>
    expect(runThreeDIcTsvKeepOutZone({ tsvPitchUm: 5 })).toEqual({
      ok: true,
      output: { keepOutUm: 10 },
    }));

  it("accepts an explicit keep-out ratio", () =>
    expect(
      runThreeDIcTsvKeepOutZone({ keepOutRatio: 3, tsvPitchUm: 10 }),
    ).toEqual({ ok: true, output: { keepOutUm: 30 } }));

  it("returns a zero zone for a zero ratio at the boundary and normalizes -0", () => {
    expect(
      runThreeDIcTsvKeepOutZone({ keepOutRatio: 0, tsvPitchUm: 5 }),
    ).toEqual({ ok: true, output: { keepOutUm: 0 } });
    const viaRunner = runThreeDIcTsvKeepOutZone({
      keepOutRatio: -0,
      tsvPitchUm: 5,
    });
    expect(viaRunner.ok).toBe(true);
    if (!viaRunner.ok) throw new Error("expected success");
    expect((viaRunner.output as { keepOutUm: number }).keepOutUm).toBe(0);
    expect(
      Object.is((viaRunner.output as { keepOutUm: number }).keepOutUm, -0),
    ).toBe(false);

    expect(
      calculateThreeDIcTsvKeepOutZone({ keepOutRatio: 0, tsvPitchUm: 5 })
        .keepOutUm,
    ).toBe(0);
    expect(
      Object.is(
        calculateThreeDIcTsvKeepOutZone({ keepOutRatio: -0, tsvPitchUm: 5 })
          .keepOutUm,
        -0,
      ),
    ).toBe(false);
  });

  it("handles fractional pitches", () =>
    expect(runThreeDIcTsvKeepOutZone({ tsvPitchUm: 0.5 })).toEqual({
      ok: true,
      output: { keepOutUm: 1 },
    }));

  it("rejects zero pitch with a stable code", () => {
    const runner = runThreeDIcTsvKeepOutZone({ tsvPitchUm: 0 });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_pitch"]).toContain(
      runner.error.issues[0].code,
    );
    expect(runner.error.issues[0].field).toBe("tsvPitchUm");

    let e: unknown = null;
    try {
      calculateThreeDIcTsvKeepOutZone({ tsvPitchUm: 0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_pitch");
  });

  it("rejects negative pitch with a stable code", () => {
    const r = runThreeDIcTsvKeepOutZone({ tsvPitchUm: -5 });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_pitch"]).toContain(
      r.error.issues[0].code,
    );
    expect(() => calculateThreeDIcTsvKeepOutZone({ tsvPitchUm: -1 })).toThrow();
  });

  it("rejects a negative ratio with a stable code", () => {
    const r = runThreeDIcTsvKeepOutZone({ keepOutRatio: -1, tsvPitchUm: 5 });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_keep_out_ratio"]).toContain(
      r.error.issues[0].code,
    );
    expect(r.error.issues[0].field).toBe("keepOutRatio");
    expect(() =>
      calculateThreeDIcTsvKeepOutZone({ keepOutRatio: -0.1, tsvPitchUm: 5 }),
    ).toThrow();
  });

  it("rejects missing required inputs", () =>
    expect(runThreeDIcTsvKeepOutZone({} as never)).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "tsvPitchUm" }] },
      ok: false,
    }));

  it("rejects wrong type and non-finite inputs via runner", () => {
    expect(runThreeDIcTsvKeepOutZone({ tsvPitchUm: "large" as never }).ok).toBe(
      false,
    );
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(runThreeDIcTsvKeepOutZone({ tsvPitchUm: bad }).ok).toBe(false);
      expect(
        runThreeDIcTsvKeepOutZone({ keepOutRatio: bad, tsvPitchUm: 5 }).ok,
      ).toBe(false);
    }
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateThreeDIcTsvKeepOutZone>[0];
      field: string;
    }> = [
      { input: { tsvPitchUm: Number.NaN }, field: "tsvPitchUm" },
      { input: { tsvPitchUm: Number.POSITIVE_INFINITY }, field: "tsvPitchUm" },
      { input: { tsvPitchUm: Number.NEGATIVE_INFINITY }, field: "tsvPitchUm" },
      {
        input: { keepOutRatio: Number.NaN, tsvPitchUm: 5 },
        field: "keepOutRatio",
      },
      {
        input: { keepOutRatio: Number.POSITIVE_INFINITY, tsvPitchUm: 5 },
        field: "keepOutRatio",
      },
      {
        input: { keepOutRatio: Number.NEGATIVE_INFINITY, tsvPitchUm: 5 },
        field: "keepOutRatio",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateThreeDIcTsvKeepOutZone(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects unknown fields and non-object input", () => {
    const unknown = runThreeDIcTsvKeepOutZone({
      tsvPitchUm: 5,
      extra: 1,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
    expect(runThreeDIcTsvKeepOutZone(null as never).ok).toBe(false);
    expect(runThreeDIcTsvKeepOutZone("pitch" as never).ok).toBe(false);
    if (!runThreeDIcTsvKeepOutZone(null as never).ok) {
      expect(
        runThreeDIcTsvKeepOutZone(null as never).error.issues[0].code,
      ).toBe("object_required");
    }
  });

  it("reports numeric overflow against an input field", () => {
    let directErr: unknown = null;
    try {
      calculateThreeDIcTsvKeepOutZone({
        keepOutRatio: Number.MAX_VALUE,
        tsvPitchUm: Number.MAX_VALUE,
      });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("numeric_overflow");
    const runner = runThreeDIcTsvKeepOutZone({
      keepOutRatio: Number.MAX_VALUE,
      tsvPitchUm: Number.MAX_VALUE,
    });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(runner.error.issues[0].code).toBe("numeric_overflow");
  });

  it("handles very small pitch without -0 or NaN", () => {
    const tiny = Number.MIN_VALUE;
    const r = runThreeDIcTsvKeepOutZone({ tsvPitchUm: tiny, keepOutRatio: 2 });
    if (r.ok) {
      const v = (r.output as { keepOutUm: number }).keepOutUm;
      expect(Number.isFinite(v)).toBe(true);
      expect(Object.is(v, -0)).toBe(false);
      expect(v).toBeGreaterThanOrEqual(0);
    } else {
      expect(r.error.issues[0].code).toBe("numeric_underflow");
    }
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(calculateThreeDIcTsvKeepOutZone({ tsvPitchUm: 5 }).keepOutUm).toBe(
      10,
    );
    expect(
      calculateThreeDIcTsvKeepOutZone({ keepOutRatio: 0, tsvPitchUm: 5 })
        .keepOutUm,
    ).toBe(0);
    expect(() => calculateThreeDIcTsvKeepOutZone({ tsvPitchUm: 0 })).toThrow();
    expect(() =>
      calculateThreeDIcTsvKeepOutZone({ tsvPitchUm: Number.NaN }),
    ).toThrow();
  });

  it("preserves properties: keepOut ∝ pitch·ratio, inverse, and monotonic", () => {
    const base = calculateThreeDIcTsvKeepOutZone({ tsvPitchUm: 5 }).keepOutUm; // 10
    const doubledPitch = calculateThreeDIcTsvKeepOutZone({
      tsvPitchUm: 10,
    }).keepOutUm;
    expect(doubledPitch).toBeCloseTo(base * 2, 12);

    const doubledRatio = calculateThreeDIcTsvKeepOutZone({
      keepOutRatio: 4,
      tsvPitchUm: 5,
    }).keepOutUm;
    expect(doubledRatio).toBeCloseTo(base * 2, 12);

    // inverse: pitch = keepOut / ratio
    const recoveredPitch = base / 2;
    expect(recoveredPitch).toBe(5);

    // monotonic: larger pitch or ratio gives larger keep-out
    const small = calculateThreeDIcTsvKeepOutZone({
      tsvPitchUm: 1,
      keepOutRatio: 1,
    }).keepOutUm;
    const large = calculateThreeDIcTsvKeepOutZone({
      tsvPitchUm: 10,
      keepOutRatio: 1,
    }).keepOutUm;
    expect(large).toBeGreaterThan(small);

    // scaling both preserves ratio
    const scaled = calculateThreeDIcTsvKeepOutZone({
      keepOutRatio: 2,
      tsvPitchUm: 2.5,
    }).keepOutUm;
    expect(scaled).toBeCloseTo(5, 12);
  });
});
