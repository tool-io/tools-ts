import { describe, expect, it } from "vitest";
import {
  annealActivationFractionExample,
  calculateAnnealActivationFraction,
  runAnnealActivationFraction,
} from "./tool.js";

describe("Anneal Activation Fraction Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runAnnealActivationFraction(annealActivationFractionExample.input),
    ).toEqual({ ok: true, output: annealActivationFractionExample.output });
  });

  it("activates nothing when the anneal time is zero", () => {
    expect(
      runAnnealActivationFraction({
        activationRatePerHour: 0.25,
        annealHours: 0,
      }),
    ).toEqual({ ok: true, output: { activatedFraction: 0 } });
    expect(
      calculateAnnealActivationFraction({
        activationRatePerHour: 0.25,
        annealHours: 0,
      }).activatedFraction,
    ).toBe(0);
  });

  it("activates nothing when the activation rate is zero", () => {
    expect(
      runAnnealActivationFraction({ activationRatePerHour: 0, annealHours: 4 }),
    ).toEqual({ ok: true, output: { activatedFraction: 0 } });
    expect(
      calculateAnnealActivationFraction({
        activationRatePerHour: 0,
        annealHours: 4,
      }).activatedFraction,
    ).toBe(0);
  });

  it("normalizes negative zero to positive zero", () => {
    const r = runAnnealActivationFraction({
      activationRatePerHour: -0,
      annealHours: 4,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) throw new Error("expected success");
    expect((r.output as { activatedFraction: number }).activatedFraction).toBe(
      0,
    );
    expect(
      Object.is(
        (r.output as { activatedFraction: number }).activatedFraction,
        -0,
      ),
    ).toBe(false);
    const t = runAnnealActivationFraction({
      activationRatePerHour: 0.25,
      annealHours: -0,
    });
    expect(t.ok).toBe(true);
    if (!t.ok) throw new Error("expected success");
    expect(
      Object.is(
        (t.output as { activatedFraction: number }).activatedFraction,
        -0,
      ),
    ).toBe(false);

    expect(
      Object.is(
        calculateAnnealActivationFraction({
          activationRatePerHour: -0,
          annealHours: 4,
        }).activatedFraction,
        -0,
      ),
    ).toBe(false);
    expect(
      Object.is(
        calculateAnnealActivationFraction({
          activationRatePerHour: 0,
          annealHours: -0,
        }).activatedFraction,
        -0,
      ),
    ).toBe(false);
  });

  it("reaches one minus e to the minus one at unit exposure", () => {
    expect(
      runAnnealActivationFraction({ activationRatePerHour: 1, annealHours: 1 }),
    ).toEqual({ ok: true, output: { activatedFraction: 0.6321205588285577 } });
    // also 2 *3 case from original test: exposure 6
    expect(
      runAnnealActivationFraction({ activationRatePerHour: 2, annealHours: 3 }),
    ).toEqual({ ok: true, output: { activatedFraction: 0.9975212478233336 } });
  });

  it("approaches complete activation for long anneals", () => {
    expect(
      runAnnealActivationFraction({
        activationRatePerHour: 50,
        annealHours: 2,
      }),
    ).toEqual({ ok: true, output: { activatedFraction: 1 } });
    // huge exposure saturates to 1, not overflow
    expect(
      calculateAnnealActivationFraction({
        activationRatePerHour: 1000,
        annealHours: 1000,
      }).activatedFraction,
    ).toBe(1);
  });

  it("matches a half completion after ten hours at a twentieth rate", () => {
    expect(
      runAnnealActivationFraction({
        activationRatePerHour: 0.05,
        annealHours: 10,
      }),
    ).toEqual({ ok: true, output: { activatedFraction: 0.3934693402873666 } });
  });

  it("increases monotonically with anneal duration and rate", () => {
    const short = runAnnealActivationFraction({
      activationRatePerHour: 0.25,
      annealHours: 1,
    });
    const long = runAnnealActivationFraction({
      activationRatePerHour: 0.25,
      annealHours: 8,
    });
    if (!short.ok || !long.ok) throw new Error("Expected success results.");
    expect(
      (long.output as { activatedFraction: number }).activatedFraction,
    ).toBeGreaterThan(
      (short.output as { activatedFraction: number }).activatedFraction,
    );
    const lowRate = calculateAnnealActivationFraction({
      activationRatePerHour: 0.1,
      annealHours: 5,
    }).activatedFraction;
    const highRate = calculateAnnealActivationFraction({
      activationRatePerHour: 1,
      annealHours: 5,
    }).activatedFraction;
    expect(highRate).toBeGreaterThan(lowRate);
  });

  it("rejects negative activation rates through schema validation and direct", () => {
    const result = runAnnealActivationFraction({
      activationRatePerHour: -0.25,
      annealHours: 4,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(["invalid_field", "invalid_activation_rate"]).toContain(
        result.error.issues[0].code,
      );
    let e: unknown = null;
    try {
      calculateAnnealActivationFraction({
        activationRatePerHour: -0.25,
        annealHours: 4,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_activation_rate");
  });

  it("rejects negative anneal durations through schema validation and direct", () => {
    const result = runAnnealActivationFraction({
      activationRatePerHour: 0.25,
      annealHours: -1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(["invalid_field", "invalid_anneal_time"]).toContain(
        result.error.issues[0].code,
      );
    expect(() =>
      calculateAnnealActivationFraction({
        activationRatePerHour: 0.25,
        annealHours: -1,
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
        runAnnealActivationFraction({
          activationRatePerHour: bad,
          annealHours: 4,
        }).ok,
      ).toBe(false);
      expect(
        runAnnealActivationFraction({
          activationRatePerHour: 0.25,
          annealHours: bad,
        }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateAnnealActivationFraction>[0];
      field: string;
    }> = [
      {
        input: { activationRatePerHour: Number.NaN, annealHours: 4 },
        field: "activationRatePerHour",
      },
      {
        input: {
          activationRatePerHour: Number.POSITIVE_INFINITY,
          annealHours: 4,
        },
        field: "activationRatePerHour",
      },
      {
        input: {
          activationRatePerHour: Number.NEGATIVE_INFINITY,
          annealHours: 4,
        },
        field: "activationRatePerHour",
      },
      {
        input: { activationRatePerHour: 0.25, annealHours: Number.NaN },
        field: "annealHours",
      },
      {
        input: {
          activationRatePerHour: 0.25,
          annealHours: Number.POSITIVE_INFINITY,
        },
        field: "annealHours",
      },
      {
        input: {
          activationRatePerHour: 0.25,
          annealHours: Number.NEGATIVE_INFINITY,
        },
        field: "annealHours",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateAnnealActivationFraction(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects wrong type, missing, unknown, and non-object inputs", () => {
    expect(
      runAnnealActivationFraction({
        activationRatePerHour: "fast" as never,
        annealHours: 4,
      }).ok,
    ).toBe(false);
    const missing = runAnnealActivationFraction({} as never);
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.error.issues[0].code).toBe("invalid_field");
    const unknown = runAnnealActivationFraction({
      activationRatePerHour: 0.25,
      annealHours: 4,
      tempC: 1000,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
    expect(runAnnealActivationFraction("anneal" as never).ok).toBe(false);
    const nonObject = runAnnealActivationFraction(null as never);
    expect(nonObject.ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("saturates to full activation when exposure exceeds the numeric range", () => {
    const input = {
      activationRatePerHour: Number.MAX_VALUE,
      annealHours: Number.MAX_VALUE,
    };
    expect(calculateAnnealActivationFraction(input)).toEqual({
      activatedFraction: 1,
    });
    expect(runAnnealActivationFraction(input)).toEqual({
      ok: true,
      output: { activatedFraction: 1 },
    });
  });

  it("handles underflow to full activation without throwing", () => {
    // very large exposure should saturate to 1, not throw overflow
    const hugeButFinite = calculateAnnealActivationFraction({
      activationRatePerHour: 1e2,
      annealHours: 1e2,
    }).activatedFraction;
    expect(hugeButFinite).toBe(1);
    expect(Number.isFinite(hugeButFinite)).toBe(true);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateAnnealActivationFraction(annealActivationFractionExample.input)
        .activatedFraction,
    ).toBeCloseTo(0.6321205588285577, 12);
    expect(
      calculateAnnealActivationFraction({
        activationRatePerHour: 0,
        annealHours: 4,
      }).activatedFraction,
    ).toBe(0);
    expect(() =>
      calculateAnnealActivationFraction({
        activationRatePerHour: -1,
        annealHours: 4,
      }),
    ).toThrow();
    expect(() =>
      calculateAnnealActivationFraction({
        activationRatePerHour: Number.NaN,
        annealHours: 4,
      }),
    ).toThrow();
  });

  it("preserves properties: fraction = 1 - exp(-rate*time), inverse, and scaling", () => {
    const rate = 0.25;
    const time = 4;
    const fraction = calculateAnnealActivationFraction({
      activationRatePerHour: rate,
      annealHours: time,
    }).activatedFraction;
    // inverse: time = -ln(1-fraction)/rate
    const recoveredTime = -Math.log(1 - fraction) / rate;
    expect(recoveredTime).toBeCloseTo(time, 12);

    // doubling time not doubling fraction but monotonic increase with diminishing returns
    const f1 = calculateAnnealActivationFraction({
      activationRatePerHour: 0.5,
      annealHours: 2,
    }).activatedFraction;
    const f2 = calculateAnnealActivationFraction({
      activationRatePerHour: 0.5,
      annealHours: 4,
    }).activatedFraction;
    expect(f2).toBeGreaterThan(f1);
    expect(f2).toBeLessThan(f1 * 2); // sublinear due to exponential

    // commutativity of product: rate*time symmetric when product same
    const a = calculateAnnealActivationFraction({
      activationRatePerHour: 2,
      annealHours: 3,
    }).activatedFraction;
    const b = calculateAnnealActivationFraction({
      activationRatePerHour: 3,
      annealHours: 2,
    }).activatedFraction;
    expect(a).toBeCloseTo(b, 12);

    // zero property
    expect(
      calculateAnnealActivationFraction({
        activationRatePerHour: 10,
        annealHours: 0,
      }).activatedFraction,
    ).toBe(0);
    // saturation monotonic
    const medium = calculateAnnealActivationFraction({
      activationRatePerHour: 0.2,
      annealHours: 5,
    }).activatedFraction;
    const large = calculateAnnealActivationFraction({
      activationRatePerHour: 0.2,
      annealHours: 20,
    }).activatedFraction;
    expect(large).toBeGreaterThan(medium);
    expect(large).toBeLessThanOrEqual(1);
  });
});
