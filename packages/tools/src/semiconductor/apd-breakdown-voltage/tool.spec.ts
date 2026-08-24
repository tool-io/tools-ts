import { describe, expect, it } from "vitest";
import {
  calculateApdBreakdownVoltage,
  apdBreakdownVoltageExample,
  runApdBreakdownVoltage,
} from "./tool.js";

describe("APD Breakdown Voltage Temperature Shift Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runApdBreakdownVoltage(apdBreakdownVoltageExample.input)).toEqual({
      ok: true,
      output: apdBreakdownVoltageExample.output,
    });
    expect(
      calculateApdBreakdownVoltage(apdBreakdownVoltageExample.input)
        .breakdownAtTempVolts,
    ).toBe(92.85);
  });

  it("returns the reference breakdown at 25 °C", () => {
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: 25,
      }),
    ).toEqual({ ok: true, output: { breakdownAtTempVolts: 100 } });
    expect(
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: 25,
      }).breakdownAtTempVolts,
    ).toBe(100);
  });

  it("raises breakdown voltage when hot", () => {
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: 125,
      }),
    ).toEqual({
      ok: true,
      output: { breakdownAtTempVolts: 111.00000000000001 },
    });
  });

  it("shifts by 16.5 percent at the 175 °C limit", () => {
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: 175,
      }),
    ).toEqual({ ok: true, output: { breakdownAtTempVolts: 116.5 } });
  });

  it("lowers breakdown voltage toward the cold limit", () => {
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: -55,
      }),
    ).toEqual({ ok: true, output: { breakdownAtTempVolts: 91.2 } });
  });

  it("scales linearly with the reference breakdown", () => {
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: 200,
        temperatureC: 75,
      }),
    ).toEqual({ ok: true, output: { breakdownAtTempVolts: 211 } });
    expect(
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: 50,
        temperatureC: 75,
      }).breakdownAtTempVolts,
    ).toBeCloseTo(52.75, 12);
  });

  it("rejects zero and negative reference breakdown", () => {
    for (const bad of [0, -1, -0, -100]) {
      const r = runApdBreakdownVoltage({
        referenceBreakdownVolts: bad,
        temperatureC: 25,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_reference_breakdown"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("referenceBreakdownVolts");
    }
    let e: unknown = null;
    try {
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: 0,
        temperatureC: 25,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_reference_breakdown");
  });

  it("rejects temperatures outside [-55, 175] °C", () => {
    for (const bad of [-56, -100, 176, 200]) {
      const r = runApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: bad,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_temperature"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("temperatureC");
    }
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: -55,
      }).ok,
    ).toBe(true);
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: 175,
      }).ok,
    ).toBe(true);
    let e: unknown = null;
    try {
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: 176,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_temperature");
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateApdBreakdownVoltage>[0];
      field: string;
    }> = [
      {
        input: {
          referenceBreakdownVolts: Number.NaN,
          temperatureC: 25,
        },
        field: "referenceBreakdownVolts",
      },
      {
        input: {
          referenceBreakdownVolts: Number.POSITIVE_INFINITY,
          temperatureC: 25,
        },
        field: "referenceBreakdownVolts",
      },
      {
        input: {
          referenceBreakdownVolts: Number.NEGATIVE_INFINITY,
          temperatureC: 25,
        },
        field: "referenceBreakdownVolts",
      },
      {
        input: { referenceBreakdownVolts: 100, temperatureC: Number.NaN },
        field: "temperatureC",
      },
      {
        input: {
          referenceBreakdownVolts: 100,
          temperatureC: Number.POSITIVE_INFINITY,
        },
        field: "temperatureC",
      },
      {
        input: {
          referenceBreakdownVolts: 100,
          temperatureC: Number.NEGATIVE_INFINITY,
        },
        field: "temperatureC",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateApdBreakdownVoltage(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: Number.NaN,
        temperatureC: 25,
      }).ok,
    ).toBe(false);
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow against an input field", () => {
    let directErr: unknown = null;
    try {
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: Number.MAX_VALUE,
        temperatureC: 175,
      });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("numeric_overflow");
    expect((directErr as { field: string }).field).toBe(
      "referenceBreakdownVolts",
    );

    const runner = runApdBreakdownVoltage({
      referenceBreakdownVolts: Number.MAX_VALUE,
      temperatureC: 175,
    });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(runner.error.issues[0].code).toBe("numeric_overflow");
  });

  it("handles very small positive reference without -0 or NaN", () => {
    const tiny = Number.MIN_VALUE;
    const r = runApdBreakdownVoltage({
      referenceBreakdownVolts: tiny,
      temperatureC: 25,
    });
    if (r.ok) {
      const v = (r.output as { breakdownAtTempVolts: number })
        .breakdownAtTempVolts;
      expect(Number.isFinite(v)).toBe(true);
      expect(Object.is(v, -0)).toBe(false);
      expect(v).toBeGreaterThan(0);
    } else {
      expect(r.error.issues[0].code).toBe("numeric_overflow");
    }
  });

  it("rejects missing, wrong type, unknown fields, and non-object", () => {
    const missing = runApdBreakdownVoltage({} as never);
    expect(missing.ok).toBe(false);
    if (!missing.ok) expect(missing.error.issues[0].code).toBe("invalid_field");
    expect(
      runApdBreakdownVoltage({
        referenceBreakdownVolts: "100V" as never,
        temperatureC: 25,
      }).ok,
    ).toBe(false);
    const unknown = runApdBreakdownVoltage({
      referenceBreakdownVolts: 100,
      temperatureC: 25,
      extra: 1,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
    expect(runApdBreakdownVoltage(null as never).ok).toBe(false);
    expect(runApdBreakdownVoltage(42 as never).ok).toBe(false);
    if (!runApdBreakdownVoltage(null as never).ok)
      expect(runApdBreakdownVoltage(null as never).error.issues[0].code).toBe(
        "object_required",
      );
  });

  it("preserves properties: factor scales breakdown, inverse recovers reference, monotonic in both", () => {
    const base = calculateApdBreakdownVoltage({
      referenceBreakdownVolts: 100,
      temperatureC: 0,
    }).breakdownAtTempVolts; // 97.25
    expect(base).toBeCloseTo(97.25, 12);

    const doubledRef = calculateApdBreakdownVoltage({
      referenceBreakdownVolts: 200,
      temperatureC: 0,
    }).breakdownAtTempVolts;
    expect(doubledRef).toBeCloseTo(base * 2, 12);

    // inverse: Vref = V(T)/factor
    const temp = 50;
    const factor = 1 + 0.0011 * (temp - 25);
    const atTemp = calculateApdBreakdownVoltage({
      referenceBreakdownVolts: 100,
      temperatureC: temp,
    }).breakdownAtTempVolts;
    const recovered = atTemp / factor;
    expect(recovered).toBeCloseTo(100, 12);

    // monotonic in temperature
    const cold = calculateApdBreakdownVoltage({
      referenceBreakdownVolts: 100,
      temperatureC: -40,
    }).breakdownAtTempVolts;
    const hot = calculateApdBreakdownVoltage({
      referenceBreakdownVolts: 100,
      temperatureC: 100,
    }).breakdownAtTempVolts;
    expect(hot).toBeGreaterThan(cold);

    // monotonic in reference
    const lowRef = calculateApdBreakdownVoltage({
      referenceBreakdownVolts: 50,
      temperatureC: 25,
    }).breakdownAtTempVolts;
    const highRef = calculateApdBreakdownVoltage({
      referenceBreakdownVolts: 150,
      temperatureC: 25,
    }).breakdownAtTempVolts;
    expect(highRef).toBeGreaterThan(lowRef);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: -40,
      }).breakdownAtTempVolts,
    ).toBe(92.85);
    expect(
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: 25,
      }).breakdownAtTempVolts,
    ).toBe(100);
    expect(() =>
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: 0,
        temperatureC: 25,
      }),
    ).toThrow();
    expect(() =>
      calculateApdBreakdownVoltage({
        referenceBreakdownVolts: 100,
        temperatureC: Number.NaN,
      }),
    ).toThrow();
  });
});
