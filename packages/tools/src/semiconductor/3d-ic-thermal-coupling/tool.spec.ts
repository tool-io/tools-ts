import { describe, expect, it } from "vitest";
import {
  calculateThreeDIcThermalCoupling,
  runThreeDIcThermalCoupling,
  threeDIcThermalCouplingExample,
} from "./tool.js";

describe("3D-IC Thermal Coupling Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runThreeDIcThermalCoupling(threeDIcThermalCouplingExample.input),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 9 } }));

  it("defaults the coupling factor to 0.15", () =>
    expect(
      runThreeDIcThermalCoupling({
        lowerTierThermalResistanceCPerW: 12,
        upperTierPowerWatts: 5,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 9 } }));

  it("scales linearly with upper-tier power", () =>
    expect(
      runThreeDIcThermalCoupling({
        ...threeDIcThermalCouplingExample.input,
        upperTierPowerWatts: 10,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 18 } }));

  it("returns zero rise for zero power at the boundary", () =>
    expect(
      runThreeDIcThermalCoupling({
        ...threeDIcThermalCouplingExample.input,
        upperTierPowerWatts: 0,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 0 } }));

  it("normalizes negative zero to positive zero and handles zero coupling/power", () => {
    const zeroPower = runThreeDIcThermalCoupling({
      couplingFactor: 0.15,
      lowerTierThermalResistanceCPerW: 12,
      upperTierPowerWatts: -0,
    });
    expect(zeroPower.ok).toBe(true);
    if (!zeroPower.ok) throw new Error("expected success");
    expect(
      (zeroPower.output as { temperatureRiseCelsius: number })
        .temperatureRiseCelsius,
    ).toBe(0);
    expect(
      Object.is(
        (zeroPower.output as { temperatureRiseCelsius: number })
          .temperatureRiseCelsius,
        -0,
      ),
    ).toBe(false);

    expect(
      runThreeDIcThermalCoupling({
        couplingFactor: 0,
        lowerTierThermalResistanceCPerW: 12,
        upperTierPowerWatts: 5,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 0 } });

    expect(
      calculateThreeDIcThermalCoupling({
        couplingFactor: 0,
        lowerTierThermalResistanceCPerW: 12,
        upperTierPowerWatts: 5,
      }).temperatureRiseCelsius,
    ).toBe(0);
    expect(
      Object.is(
        calculateThreeDIcThermalCoupling({
          couplingFactor: -0,
          lowerTierThermalResistanceCPerW: 12,
          upperTierPowerWatts: 5,
        }).temperatureRiseCelsius,
        -0,
      ),
    ).toBe(false);
  });

  it("accepts a coupling factor of exactly one and zero", () => {
    expect(
      runThreeDIcThermalCoupling({
        ...threeDIcThermalCouplingExample.input,
        couplingFactor: 1,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 60 } });
    expect(
      runThreeDIcThermalCoupling({
        ...threeDIcThermalCouplingExample.input,
        couplingFactor: 0,
      }),
    ).toEqual({ ok: true, output: { temperatureRiseCelsius: 0 } });
  });

  it("rejects negative power with a stable code", () => {
    const runner = runThreeDIcThermalCoupling({
      ...threeDIcThermalCouplingExample.input,
      upperTierPowerWatts: -1,
    });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_power"]).toContain(
      runner.error.issues[0].code,
    );
    expect(runner.error.issues[0].field).toBe("upperTierPowerWatts");

    let directErr: unknown = null;
    try {
      calculateThreeDIcThermalCoupling({
        couplingFactor: 0.15,
        lowerTierThermalResistanceCPerW: 12,
        upperTierPowerWatts: -1,
      });
    } catch (e) {
      directErr = e;
    }
    expect((directErr as { code: string }).code).toBe("invalid_power");
  });

  it("rejects zero and negative thermal resistance with a stable code", () => {
    for (const bad of [0, -5, -0.001]) {
      const r = runThreeDIcThermalCoupling({
        ...threeDIcThermalCouplingExample.input,
        lowerTierThermalResistanceCPerW: bad,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_thermal_resistance"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("lowerTierThermalResistanceCPerW");
    }
    let e: unknown = null;
    try {
      calculateThreeDIcThermalCoupling({
        couplingFactor: 0.15,
        lowerTierThermalResistanceCPerW: 0,
        upperTierPowerWatts: 5,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_thermal_resistance");
  });

  it("rejects a coupling factor outside 0-1 with a stable code", () => {
    for (const bad of [1.01, -0.15, 2, -1]) {
      const r = runThreeDIcThermalCoupling({
        ...threeDIcThermalCouplingExample.input,
        couplingFactor: bad,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_coupling_factor"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("couplingFactor");
    }
    expect(() =>
      calculateThreeDIcThermalCoupling({
        couplingFactor: 1.01,
        lowerTierThermalResistanceCPerW: 12,
        upperTierPowerWatts: 5,
      }),
    ).toThrow();
    expect(() =>
      calculateThreeDIcThermalCoupling({
        couplingFactor: -0.1,
        lowerTierThermalResistanceCPerW: 12,
        upperTierPowerWatts: 5,
      }),
    ).toThrow();
  });

  it("rejects missing required inputs", () =>
    expect(runThreeDIcThermalCoupling({} as never)).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "lowerTierThermalResistanceCPerW" },
        ],
      },
      ok: false,
    }));

  it("rejects wrong type and non-finite inputs via runner", () => {
    expect(
      runThreeDIcThermalCoupling({
        couplingFactor: "hot" as never,
        lowerTierThermalResistanceCPerW: 12,
        upperTierPowerWatts: 5,
      }).ok,
    ).toBe(false);
    expect(
      runThreeDIcThermalCoupling({
        couplingFactor: 0.15,
        lowerTierThermalResistanceCPerW: "high" as never,
        upperTierPowerWatts: 5,
      }).ok,
    ).toBe(false);
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runThreeDIcThermalCoupling({
          couplingFactor: bad,
          lowerTierThermalResistanceCPerW: 12,
          upperTierPowerWatts: 5,
        }).ok,
      ).toBe(false);
      expect(
        runThreeDIcThermalCoupling({
          couplingFactor: 0.15,
          lowerTierThermalResistanceCPerW: bad,
          upperTierPowerWatts: 5,
        }).ok,
      ).toBe(false);
      expect(
        runThreeDIcThermalCoupling({
          couplingFactor: 0.15,
          lowerTierThermalResistanceCPerW: 12,
          upperTierPowerWatts: bad,
        }).ok,
      ).toBe(false);
    }
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateThreeDIcThermalCoupling>[0];
      field: string;
    }> = [
      {
        input: {
          couplingFactor: Number.NaN,
          lowerTierThermalResistanceCPerW: 12,
          upperTierPowerWatts: 5,
        },
        field: "couplingFactor",
      },
      {
        input: {
          couplingFactor: Number.POSITIVE_INFINITY,
          lowerTierThermalResistanceCPerW: 12,
          upperTierPowerWatts: 5,
        },
        field: "couplingFactor",
      },
      {
        input: {
          couplingFactor: 0.15,
          lowerTierThermalResistanceCPerW: Number.NaN,
          upperTierPowerWatts: 5,
        },
        field: "lowerTierThermalResistanceCPerW",
      },
      {
        input: {
          couplingFactor: 0.15,
          lowerTierThermalResistanceCPerW: Number.POSITIVE_INFINITY,
          upperTierPowerWatts: 5,
        },
        field: "lowerTierThermalResistanceCPerW",
      },
      {
        input: {
          couplingFactor: 0.15,
          lowerTierThermalResistanceCPerW: 12,
          upperTierPowerWatts: Number.NaN,
        },
        field: "upperTierPowerWatts",
      },
      {
        input: {
          couplingFactor: 0.15,
          lowerTierThermalResistanceCPerW: 12,
          upperTierPowerWatts: Number.POSITIVE_INFINITY,
        },
        field: "upperTierPowerWatts",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateThreeDIcThermalCoupling(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects unknown fields and non-object input", () => {
    expect(
      runThreeDIcThermalCoupling({
        ...threeDIcThermalCouplingExample.input,
        extra: 1,
      } as never).ok,
    ).toBe(false);
    const unknown = runThreeDIcThermalCoupling({
      ...threeDIcThermalCouplingExample.input,
      unknown: 1,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runThreeDIcThermalCoupling(null as never);
    expect(nonObject.ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
    expect(runThreeDIcThermalCoupling("hot" as never).ok).toBe(false);
  });

  it("reports numeric overflow against an input field", () => {
    let directErr: unknown = null;
    try {
      calculateThreeDIcThermalCoupling({
        couplingFactor: 1,
        lowerTierThermalResistanceCPerW: Number.MAX_VALUE,
        upperTierPowerWatts: Number.MAX_VALUE,
      });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("numeric_overflow");

    const runner = runThreeDIcThermalCoupling({
      couplingFactor: 1,
      lowerTierThermalResistanceCPerW: Number.MAX_VALUE,
      upperTierPowerWatts: Number.MAX_VALUE,
    });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(runner.error.issues[0].code).toBe("numeric_overflow");
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateThreeDIcThermalCoupling(threeDIcThermalCouplingExample.input)
        .temperatureRiseCelsius,
    ).toBe(9);
    expect(
      calculateThreeDIcThermalCoupling({
        couplingFactor: 0.15,
        lowerTierThermalResistanceCPerW: 12,
        upperTierPowerWatts: 0,
      }).temperatureRiseCelsius,
    ).toBe(0);
    expect(() =>
      calculateThreeDIcThermalCoupling({
        couplingFactor: 0.15,
        lowerTierThermalResistanceCPerW: 0,
        upperTierPowerWatts: 5,
      }),
    ).toThrow();
  });

  it("preserves properties: rise ∝ power·resistance, inverse and monotonic", () => {
    const base = calculateThreeDIcThermalCoupling(
      threeDIcThermalCouplingExample.input,
    ).temperatureRiseCelsius;
    const doubledPower = calculateThreeDIcThermalCoupling({
      ...threeDIcThermalCouplingExample.input,
      upperTierPowerWatts: 10,
    }).temperatureRiseCelsius;
    expect(doubledPower).toBeCloseTo(base * 2, 12);

    const doubledResistance = calculateThreeDIcThermalCoupling({
      ...threeDIcThermalCouplingExample.input,
      lowerTierThermalResistanceCPerW: 24,
    }).temperatureRiseCelsius;
    expect(doubledResistance).toBeCloseTo(base * 2, 12);

    const halvedFactor = calculateThreeDIcThermalCoupling({
      ...threeDIcThermalCouplingExample.input,
      couplingFactor: 0.075,
    }).temperatureRiseCelsius;
    expect(halvedFactor).toBeCloseTo(base * 0.5, 12);

    // inverse: power = rise / (factor * resistance)
    const recoveredPower = base / (0.15 * 12);
    expect(recoveredPower).toBeCloseTo(5, 12);

    // monotonic: higher power or resistance gives larger rise
    const low = calculateThreeDIcThermalCoupling({
      couplingFactor: 0.1,
      lowerTierThermalResistanceCPerW: 5,
      upperTierPowerWatts: 1,
    }).temperatureRiseCelsius;
    const high = calculateThreeDIcThermalCoupling({
      couplingFactor: 0.1,
      lowerTierThermalResistanceCPerW: 5,
      upperTierPowerWatts: 10,
    }).temperatureRiseCelsius;
    expect(high).toBeGreaterThan(low);

    // proportional to product: scaling all by 2 multiplies rise by 8? Actually linear in each.
    // check commutativity
    const a = calculateThreeDIcThermalCoupling({
      couplingFactor: 0.2,
      lowerTierThermalResistanceCPerW: 10,
      upperTierPowerWatts: 3,
    }).temperatureRiseCelsius;
    expect(a).toBeCloseTo(6, 12);
  });
});
