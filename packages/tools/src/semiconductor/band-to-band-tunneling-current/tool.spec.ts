import { describe, expect, it } from "vitest";
import {
  bandToBandTunnelingCurrentExample,
  calculateBandToBandTunnelingCurrent,
  runBandToBandTunnelingCurrent,
} from "./tool.js";

describe("Band-to-Band Tunneling Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runBandToBandTunnelingCurrent(bandToBandTunnelingCurrentExample.input),
    ).toEqual({
      ok: true,
      output: bandToBandTunnelingCurrentExample.output,
    }));

  it("applies the default characteristic field and coefficient", () => {
    const result = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 5,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.btbtNanoAmperes).toBeCloseTo(5 * Math.exp(-8), 18);
    expect(
      calculateBandToBandTunnelingCurrent({ electricFieldMVPerCm: 5 })
        .btbtNanoAmperes,
    ).toBeCloseTo(5 * Math.exp(-8), 18);
  });

  it("honors explicit characteristic field and coefficient", () => {
    const result = runBandToBandTunnelingCurrent({
      characteristicFieldMVPerCm: 20,
      electricFieldMVPerCm: 4,
      tunnelingCoefficient: 2,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.btbtNanoAmperes).toBeCloseTo(2 * 4 * Math.exp(-5), 18);
    expect(
      calculateBandToBandTunnelingCurrent({
        characteristicFieldMVPerCm: 20,
        electricFieldMVPerCm: 4,
        tunnelingCoefficient: 2,
      }).btbtNanoAmperes,
    ).toBeCloseTo(2 * 4 * Math.exp(-5), 18);
  });

  it("rises with junction field once past the knee", () => {
    const moderate = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 6,
    });
    const strong = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 7,
    });
    expect(moderate.ok).toBe(true);
    expect(strong.ok).toBe(true);
    if (!moderate.ok || !strong.ok) return;
    const moderateValue = moderate.output.btbtNanoAmperes as number;
    const strongValue = strong.output.btbtNanoAmperes as number;
    expect(strongValue).toBeGreaterThan(moderateValue);
  });

  it("suppresses tunneling far below the characteristic field", () => {
    const result = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 1,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.btbtNanoAmperes).toBeLessThan(1e-12);
  });

  it("normalizes -0 output to 0 and handles underflow", () => {
    const tinyField = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: Number.MIN_VALUE,
    });
    if (tinyField.ok) {
      expect(Object.is(tinyField.output.btbtNanoAmperes, -0)).toBe(false);
      expect(Number.isFinite(tinyField.output.btbtNanoAmperes)).toBe(true);
    } else {
      expect(tinyField.error.issues[0].code).toBe("numeric_overflow");
    }
    // zero coefficient yields 0
    const zeroCoeff = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 5,
      tunnelingCoefficient: 0,
    });
    expect(zeroCoeff).toEqual({ ok: true, output: { btbtNanoAmperes: 0 } });
    expect(
      calculateBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        tunnelingCoefficient: 0,
      }).btbtNanoAmperes,
    ).toBe(0);
    expect(
      Object.is(
        calculateBandToBandTunnelingCurrent({
          electricFieldMVPerCm: 5,
          tunnelingCoefficient: 0,
        }).btbtNanoAmperes,
        -0,
      ),
    ).toBe(false);
  });

  it("rejects zero electric field", () => {
    const r = runBandToBandTunnelingCurrent({ electricFieldMVPerCm: 0 });
    expect(r).toMatchObject({
      error: { issues: [{ field: "electricFieldMVPerCm" }] },
      ok: false,
    });
    expect(["invalid_field", "invalid_electric_field"]).toContain(
      (r as { ok: false; error: { issues: Array<{ code: string }> } }).error
        .issues[0].code,
    );
    let e: unknown = null;
    try {
      calculateBandToBandTunnelingCurrent({ electricFieldMVPerCm: 0 });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_electric_field");
  });

  it("rejects a negative electric field", () => {
    const r = runBandToBandTunnelingCurrent({ electricFieldMVPerCm: -5 });
    expect(r).toMatchObject({
      error: { issues: [{ field: "electricFieldMVPerCm" }] },
      ok: false,
    });
    expect(() =>
      calculateBandToBandTunnelingCurrent({ electricFieldMVPerCm: -5 }),
    ).toThrow();
  });

  it("rejects -0 electric field", () => {
    const r = runBandToBandTunnelingCurrent({ electricFieldMVPerCm: -0 });
    expect(r.ok).toBe(false);
    expect(() =>
      calculateBandToBandTunnelingCurrent({ electricFieldMVPerCm: -0 }),
    ).toThrow();
  });

  it("rejects invalid characteristic field and tunneling coefficient", () => {
    expect(
      runBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        characteristicFieldMVPerCm: 0,
      }).ok,
    ).toBe(false);
    expect(
      runBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        characteristicFieldMVPerCm: -10,
      }).ok,
    ).toBe(false);
    expect(
      runBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        characteristicFieldMVPerCm: Number.NaN,
      }).ok,
    ).toBe(false);
    expect(
      runBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        tunnelingCoefficient: -1,
      }).ok,
    ).toBe(false);
    expect(
      runBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        tunnelingCoefficient: Number.NaN,
      }).ok,
    ).toBe(false);
    let e: unknown = null;
    try {
      calculateBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        characteristicFieldMVPerCm: 0,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { field: string }).field).toBe("characteristicFieldMVPerCm");
    let e2: unknown = null;
    try {
      calculateBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        tunnelingCoefficient: -1,
      });
    } catch (err) {
      e2 = err;
    }
    expect((e2 as { field: string }).field).toBe("tunnelingCoefficient");
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateBandToBandTunnelingCurrent>[0];
      field: string;
    }> = [
      {
        input: { electricFieldMVPerCm: Number.NaN },
        field: "electricFieldMVPerCm",
      },
      {
        input: { electricFieldMVPerCm: Number.POSITIVE_INFINITY },
        field: "electricFieldMVPerCm",
      },
      {
        input: { electricFieldMVPerCm: Number.NEGATIVE_INFINITY },
        field: "electricFieldMVPerCm",
      },
      {
        input: {
          electricFieldMVPerCm: 5,
          characteristicFieldMVPerCm: Number.NaN,
        },
        field: "characteristicFieldMVPerCm",
      },
      {
        input: {
          electricFieldMVPerCm: 5,
          characteristicFieldMVPerCm: Number.POSITIVE_INFINITY,
        },
        field: "characteristicFieldMVPerCm",
      },
      {
        input: {
          electricFieldMVPerCm: 5,
          tunnelingCoefficient: Number.NaN,
        },
        field: "tunnelingCoefficient",
      },
      {
        input: {
          electricFieldMVPerCm: 5,
          tunnelingCoefficient: Number.POSITIVE_INFINITY,
        },
        field: "tunnelingCoefficient",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateBandToBandTunnelingCurrent(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(
      runBandToBandTunnelingCurrent({
        electricFieldMVPerCm: Number.NaN,
      }).ok,
    ).toBe(false);
    expect(
      runBandToBandTunnelingCurrent({
        electricFieldMVPerCm: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow against an input field", () => {
    let directErr: unknown = null;
    try {
      calculateBandToBandTunnelingCurrent({
        electricFieldMVPerCm: Number.MAX_VALUE,
        tunnelingCoefficient: Number.MAX_VALUE,
        characteristicFieldMVPerCm: 40,
      });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("numeric_overflow");
    // field could be electricField or tunnelingCoefficient depending on first overflow
    expect(["electricFieldMVPerCm", "tunnelingCoefficient"]).toContain(
      (directErr as { field: string }).field,
    );

    const runner = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: Number.MAX_VALUE,
      tunnelingCoefficient: Number.MAX_VALUE,
    });
    expect(runner.ok).toBe(false);
    if (!runner.ok)
      expect(runner.error.issues[0].code).toBe("numeric_overflow");
  });

  it("scales linearly with the tunneling coefficient", () => {
    const unit = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 5,
      tunnelingCoefficient: 1,
    });
    const scaled = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 5,
      tunnelingCoefficient: 3,
    });
    expect(unit.ok).toBe(true);
    expect(scaled.ok).toBe(true);
    if (!unit.ok || !scaled.ok) return;
    const unitValue = unit.output.btbtNanoAmperes as number;
    const scaledValue = scaled.output.btbtNanoAmperes as number;
    expect(scaledValue).toBeCloseTo(3 * unitValue, 12);
    // direct
    expect(
      calculateBandToBandTunnelingCurrent({
        electricFieldMVPerCm: 5,
        tunnelingCoefficient: 3,
      }).btbtNanoAmperes,
    ).toBeCloseTo(
      3 *
        calculateBandToBandTunnelingCurrent({
          electricFieldMVPerCm: 5,
          tunnelingCoefficient: 1,
        }).btbtNanoAmperes,
      12,
    );
  });

  it("rejects missing, wrong type, unknown fields, and non-object", () => {
    expect(
      runBandToBandTunnelingCurrent({ characteristicFieldMVPerCm: 40 } as never)
        .ok,
    ).toBe(false);
    expect(
      runBandToBandTunnelingCurrent({
        electricFieldMVPerCm: "5" as never,
      }).ok,
    ).toBe(false);
    const unknown = runBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 5,
      extra: 1,
    } as never);
    expect(unknown).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    expect(runBandToBandTunnelingCurrent(null as never).ok).toBe(false);
    expect(runBandToBandTunnelingCurrent(42 as never).ok).toBe(false);
    if (!runBandToBandTunnelingCurrent(null as never).ok)
      expect(
        runBandToBandTunnelingCurrent(null as never).error.issues[0].code,
      ).toBe("object_required");
  });

  it("preserves properties: formula exact, monotonic above knee, inverse via E field", () => {
    const E = 5;
    const E0 = 40;
    const coeff = 1;
    const expected = coeff * E * Math.exp(-E0 / E);
    expect(
      calculateBandToBandTunnelingCurrent({
        electricFieldMVPerCm: E,
        characteristicFieldMVPerCm: E0,
        tunnelingCoefficient: coeff,
      }).btbtNanoAmperes,
    ).toBeCloseTo(expected, 12);

    // monotonic above knee ~6-7
    const low = calculateBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 6,
    }).btbtNanoAmperes;
    const high = calculateBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 8,
    }).btbtNanoAmperes;
    expect(high).toBeGreaterThan(low);

    // inverse: coeff = I / (E*exp(-E0/E))
    const I = calculateBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 5,
      characteristicFieldMVPerCm: 40,
      tunnelingCoefficient: 2.5,
    }).btbtNanoAmperes;
    const recoveredCoeff = I / (5 * Math.exp(-40 / 5));
    expect(recoveredCoeff).toBeCloseTo(2.5, 12);

    // scaling with coeff
    const base = calculateBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 5,
      tunnelingCoefficient: 1,
    }).btbtNanoAmperes;
    const doubled = calculateBandToBandTunnelingCurrent({
      electricFieldMVPerCm: 5,
      tunnelingCoefficient: 2,
    }).btbtNanoAmperes;
    expect(doubled).toBeCloseTo(base * 2, 12);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateBandToBandTunnelingCurrent({ electricFieldMVPerCm: 5 })
        .btbtNanoAmperes,
    ).toBeCloseTo(0.0016773131395125592, 12);
    expect(() =>
      calculateBandToBandTunnelingCurrent({ electricFieldMVPerCm: 0 }),
    ).toThrow();
    expect(() =>
      calculateBandToBandTunnelingCurrent({
        electricFieldMVPerCm: Number.NaN,
      }),
    ).toThrow();
    expect(
      runBandToBandTunnelingCurrent(bandToBandTunnelingCurrentExample.input),
    ).toEqual({
      ok: true,
      output: bandToBandTunnelingCurrentExample.output,
    });
  });
});
