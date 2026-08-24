import { describe, expect, it } from "vitest";
import {
  baseWidthModulationExample,
  calculateBaseWidthModulation,
  runBaseWidthModulation,
} from "./tool.js";

const BASE = {
  acceptorDopingPerCm3: 1e17,
  baseWidthUm: 5,
  builtInVoltageV: 0.7,
};

describe("bjt base width modulation calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBaseWidthModulation(baseWidthModulationExample.input)).toEqual({
      ok: true,
      output: baseWidthModulationExample.output,
    });
    expect(
      calculateBaseWidthModulation(baseWidthModulationExample.input)
        .fractionalChange,
    ).toBeCloseTo(0.035270767929895544, 12);
  });

  it("returns zero depletion widening at zero CB bias", () => {
    expect(
      calculateBaseWidthModulation({ ...BASE, collectorBaseVoltageV: 0 })
        .fractionalChange,
    ).toBe(0);
    const runner = runBaseWidthModulation({
      ...BASE,
      collectorBaseVoltageV: 0,
    });
    expect(runner).toEqual({ ok: true, output: { fractionalChange: 0 } });
    expect(
      Object.is(
        calculateBaseWidthModulation({ ...BASE, collectorBaseVoltageV: 0 })
          .fractionalChange,
        -0,
      ),
    ).toBe(false);
  });

  it("widens sub-linearly with reverse bias", () => {
    const at2V = calculateBaseWidthModulation({
      ...BASE,
      collectorBaseVoltageV: 2,
    }).fractionalChange;
    const at5V = calculateBaseWidthModulation({
      ...BASE,
      collectorBaseVoltageV: 5,
    }).fractionalChange;
    expect(at5V).toBeGreaterThan(at2V);
    expect(at5V / at2V).toBeLessThan(5 / 2);
    // via runner
    const r2 = runBaseWidthModulation({ ...BASE, collectorBaseVoltageV: 2 });
    const r5 = runBaseWidthModulation({ ...BASE, collectorBaseVoltageV: 5 });
    expect(r2.ok && r5.ok).toBe(true);
    if (!r2.ok || !r5.ok) throw new Error("expected success");
    expect(
      (r5.output.fractionalChange as number) /
        (r2.output.fractionalChange as number),
    ).toBeLessThan(5 / 2);
  });

  it("normalizes -0 output to 0 and handles tiny base width conversion", () => {
    const tinyWidth = runBaseWidthModulation({
      ...BASE,
      baseWidthUm: Number.MIN_VALUE,
      collectorBaseVoltageV: 0,
    });
    if (tinyWidth.ok) {
      expect(Object.is(tinyWidth.output.fractionalChange, -0)).toBe(false);
    } else {
      expect(tinyWidth.error.issues[0].code).toBe("numeric_overflow");
    }
    const zeroBiasDirect = calculateBaseWidthModulation({
      ...BASE,
      collectorBaseVoltageV: 0,
    });
    expect(Object.is(zeroBiasDirect.fractionalChange, -0)).toBe(false);
    expect(zeroBiasDirect.fractionalChange).toBe(0);
  });

  it("rejects invalid inputs through execution", () => {
    for (const bad of [
      { ...BASE, collectorBaseVoltageV: -1 },
      { ...BASE, acceptorDopingPerCm3: 0 },
      { ...BASE, baseWidthUm: 0 },
      { ...BASE, builtInVoltageV: 0 },
      { ...BASE, builtInVoltageV: -0.5 },
      { ...BASE, acceptorDopingPerCm3: -1e16 },
    ])
      expect(runBaseWidthModulation(bad).ok).toBe(false);
  });

  it("rejects -0 for strictly positive fields", () => {
    expect(
      runBaseWidthModulation({
        ...BASE,
        collectorBaseVoltageV: 1,
        baseWidthUm: -0,
      }).ok,
    ).toBe(false);
    expect(
      runBaseWidthModulation({
        ...BASE,
        collectorBaseVoltageV: 1,
        builtInVoltageV: -0,
      }).ok,
    ).toBe(false);
    expect(() =>
      calculateBaseWidthModulation({
        ...BASE,
        collectorBaseVoltageV: 1,
        baseWidthUm: -0,
      }),
    ).toThrow();
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateBaseWidthModulation>[0];
      field: string;
    }> = [
      {
        input: {
          ...BASE,
          collectorBaseVoltageV: 1,
          acceptorDopingPerCm3: Number.NaN,
        },
        field: "acceptorDopingPerCm3",
      },
      {
        input: {
          ...BASE,
          collectorBaseVoltageV: 1,
          acceptorDopingPerCm3: Number.POSITIVE_INFINITY,
        },
        field: "acceptorDopingPerCm3",
      },
      {
        input: { ...BASE, collectorBaseVoltageV: 1, baseWidthUm: Number.NaN },
        field: "baseWidthUm",
      },
      {
        input: {
          ...BASE,
          collectorBaseVoltageV: 1,
          baseWidthUm: Number.POSITIVE_INFINITY,
        },
        field: "baseWidthUm",
      },
      {
        input: {
          ...BASE,
          collectorBaseVoltageV: 1,
          builtInVoltageV: Number.NaN,
        },
        field: "builtInVoltageV",
      },
      {
        input: {
          ...BASE,
          collectorBaseVoltageV: 1,
          builtInVoltageV: Number.POSITIVE_INFINITY,
        },
        field: "builtInVoltageV",
      },
      {
        input: {
          ...BASE,
          acceptorDopingPerCm3: 1e17,
          baseWidthUm: 5,
          builtInVoltageV: 0.7,
          collectorBaseVoltageV: Number.NaN,
        },
        field: "collectorBaseVoltageV",
      },
      {
        input: { ...BASE, collectorBaseVoltageV: Number.POSITIVE_INFINITY },
        field: "collectorBaseVoltageV",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateBaseWidthModulation(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(
      runBaseWidthModulation({ ...BASE, collectorBaseVoltageV: Number.NaN }).ok,
    ).toBe(false);
    expect(
      runBaseWidthModulation({
        ...BASE,
        collectorBaseVoltageV: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow against an input field", () => {
    let directErr: unknown = null;
    try {
      calculateBaseWidthModulation({
        acceptorDopingPerCm3: Number.MIN_VALUE,
        baseWidthUm: 5,
        builtInVoltageV: 0.7,
        collectorBaseVoltageV: 5,
      });
    } catch (e) {
      directErr = e;
    }
    // MIN_VALUE acceptor makes q*NA underflow to 0 => ratio Infinity => overflow at acceptor
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("numeric_overflow");
    expect((directErr as { field: string }).field).toBe("acceptorDopingPerCm3");

    const runner = runBaseWidthModulation({
      acceptorDopingPerCm3: Number.MIN_VALUE,
      baseWidthUm: 5,
      builtInVoltageV: 0.7,
      collectorBaseVoltageV: 5,
    });
    expect(runner.ok).toBe(false);
    if (!runner.ok)
      expect(runner.error.issues[0].code).toBe("numeric_overflow");

    // total voltage overflow
    let e2: unknown = null;
    try {
      calculateBaseWidthModulation({
        acceptorDopingPerCm3: 1e17,
        baseWidthUm: 5,
        builtInVoltageV: Number.MAX_VALUE,
        collectorBaseVoltageV: Number.MAX_VALUE,
      });
    } catch (err) {
      e2 = err;
    }
    expect(e2).not.toBeNull();
    expect((e2 as { code: string }).code).toBe("numeric_overflow");
  });

  it("handles underflow fractionalChange that yields 0 as finite", () => {
    const under = calculateBaseWidthModulation({
      acceptorDopingPerCm3: 1e19,
      baseWidthUm: 1e6,
      builtInVoltageV: 0.7,
      collectorBaseVoltageV: 1e-12,
    });
    expect(Number.isFinite(under.fractionalChange)).toBe(true);
    expect(under.fractionalChange).toBeGreaterThanOrEqual(0);
    expect(Object.is(under.fractionalChange, -0)).toBe(false);
  });

  it("rejects missing, wrong type, unknown fields, and non-object", () => {
    expect(runBaseWidthModulation({} as never).ok).toBe(false);
    expect(
      runBaseWidthModulation({ ...BASE, collectorBaseVoltageV: "5" as never })
        .ok,
    ).toBe(false);
    const unknown = runBaseWidthModulation({
      ...BASE,
      collectorBaseVoltageV: 5,
      extra: 1,
    } as never);
    expect(unknown).toMatchObject({
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
      ok: false,
    });
    expect(runBaseWidthModulation(null as never).ok).toBe(false);
    expect(runBaseWidthModulation(42 as never).ok).toBe(false);
    if (!runBaseWidthModulation(null as never).ok)
      expect(runBaseWidthModulation(null as never).error.issues[0].code).toBe(
        "object_required",
      );
  });

  it("preserves properties: formula exact, inverse via doping, monotonic with Vcb and doping", () => {
    const EPS = 11.7 * 8.854187817e-14;
    const q = 1.602176634e-19;
    const input = { ...BASE, collectorBaseVoltageV: 5 };
    const expected =
      ((Math.sqrt(0.7 + 5) - Math.sqrt(0.7)) *
        Math.sqrt((2 * EPS) / (q * 1e17))) /
      (5 * 1e-4);
    expect(calculateBaseWidthModulation(input).fractionalChange).toBeCloseTo(
      expected,
      12,
    );

    // inverse: for same Vcb, higher doping gives smaller fractionalChange
    const lowDoping = calculateBaseWidthModulation({
      ...BASE,
      acceptorDopingPerCm3: 1e16,
      collectorBaseVoltageV: 5,
    }).fractionalChange;
    const highDoping = calculateBaseWidthModulation({
      ...BASE,
      acceptorDopingPerCm3: 1e18,
      collectorBaseVoltageV: 5,
    }).fractionalChange;
    expect(highDoping).toBeLessThan(lowDoping);
    // scaling with 1/sqrt(NA)
    expect(lowDoping / highDoping).toBeCloseTo(Math.sqrt(1e18 / 1e16), 10);

    // narrower base => larger fractional change (inverse with Wb)
    const wide = calculateBaseWidthModulation({
      ...BASE,
      baseWidthUm: 10,
      collectorBaseVoltageV: 5,
    }).fractionalChange;
    const narrow = calculateBaseWidthModulation({
      ...BASE,
      baseWidthUm: 5,
      collectorBaseVoltageV: 5,
    }).fractionalChange;
    expect(narrow).toBeCloseTo(wide * 2, 12);

    // monotonic with Vcb already tested
    const at1 = calculateBaseWidthModulation({
      ...BASE,
      collectorBaseVoltageV: 1,
    }).fractionalChange;
    const at10 = calculateBaseWidthModulation({
      ...BASE,
      collectorBaseVoltageV: 10,
    }).fractionalChange;
    expect(at10).toBeGreaterThan(at1);
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateBaseWidthModulation(baseWidthModulationExample.input)
        .fractionalChange,
    ).toBeCloseTo(0.035270767929895544, 12);
    expect(
      calculateBaseWidthModulation({ ...BASE, collectorBaseVoltageV: 0 })
        .fractionalChange,
    ).toBe(0);
    expect(() =>
      calculateBaseWidthModulation({ ...BASE, collectorBaseVoltageV: -1 }),
    ).toThrow();
    expect(() =>
      calculateBaseWidthModulation({
        ...BASE,
        collectorBaseVoltageV: 1,
        baseWidthUm: Number.NaN,
      }),
    ).toThrow();
  });
});
