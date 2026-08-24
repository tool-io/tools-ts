import { describe, expect, it } from "vitest";
import {
  calculateDiffusionCapacitance,
  diffusionCapacitanceExample,
  runDiffusionCapacitance,
} from "./tool.js";
import type { DiffusionCapacitanceOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDiffusionCapacitance>,
): DiffusionCapacitanceOutput => {
  if (!result.ok) throw new Error("Expected success result.");
  return result.output as DiffusionCapacitanceOutput;
};

describe("diffusion capacitance calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiffusionCapacitance(diffusionCapacitanceExample.input)).toEqual({
      ok: true,
      output: diffusionCapacitanceExample.output,
    });
    expect(
      calculateDiffusionCapacitance(diffusionCapacitanceExample.input)
        .capacitanceNanoF,
    ).toBe(diffusionCapacitanceExample.output.capacitanceNanoF);
  });

  it("scales linearly with current and lifetime via runner and direct", () => {
    const base = calculateDiffusionCapacitance({
      forwardCurrentMa: 1,
      idealityFactor: 1,
      lifetimeNs: 100,
    }).capacitanceNanoF;
    const doubledCurrent = calculateDiffusionCapacitance({
      forwardCurrentMa: 2,
      idealityFactor: 1,
      lifetimeNs: 100,
    }).capacitanceNanoF;
    const doubledLifetime = calculateDiffusionCapacitance({
      forwardCurrentMa: 1,
      idealityFactor: 1,
      lifetimeNs: 200,
    }).capacitanceNanoF;
    expect(doubledCurrent).toBeCloseTo(base * 2, 12);
    expect(doubledLifetime).toBeCloseTo(base * 2, 12);
    expect(
      outputOf(
        runDiffusionCapacitance({
          forwardCurrentMa: 2,
          lifetimeNs: 100,
          idealityFactor: 1,
        }),
      ).capacitanceNanoF,
    ).toBeCloseTo(base * 2, 12);
  });

  it("yields zero capacitance for zero current and normalizes -0", () => {
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: 0,
        lifetimeNs: 100,
        idealityFactor: 1,
      }),
    ).toEqual({ ok: true, output: { capacitanceNanoF: 0 } });
    const viaDirect = calculateDiffusionCapacitance({
      forwardCurrentMa: 0,
      lifetimeNs: 100,
      idealityFactor: 1,
    }).capacitanceNanoF;
    expect(viaDirect).toBe(0);
    expect(Object.is(viaDirect, -0)).toBe(false);
    const minusZero = calculateDiffusionCapacitance({
      forwardCurrentMa: -0,
      lifetimeNs: 100,
      idealityFactor: 1,
    }).capacitanceNanoF;
    expect(Object.is(minusZero, -0)).toBe(false);
    expect(
      outputOf(
        runDiffusionCapacitance({
          forwardCurrentMa: -0,
          lifetimeNs: 100,
          idealityFactor: 1,
        }),
      ).capacitanceNanoF,
    ).toBe(0);
  });

  it("uses defaults for ideality and temperature", () => {
    const withDefaults = runDiffusionCapacitance({
      forwardCurrentMa: 1,
      lifetimeNs: 100,
    });
    const explicit = runDiffusionCapacitance({
      forwardCurrentMa: 1,
      lifetimeNs: 100,
      idealityFactor: 1,
      temperatureK: 300,
    });
    expect(withDefaults).toEqual(explicit);
    expect(
      calculateDiffusionCapacitance({ forwardCurrentMa: 1, lifetimeNs: 100 })
        .capacitanceNanoF,
    ).toBe(diffusionCapacitanceExample.output.capacitanceNanoF);
  });

  it("rejects missing required inputs", () => {
    expect(runDiffusionCapacitance({} as never).ok).toBe(false);
    expect(runDiffusionCapacitance({ lifetimeNs: 100 } as never).ok).toBe(
      false,
    );
    expect(runDiffusionCapacitance({ forwardCurrentMa: 1 } as never).ok).toBe(
      false,
    );
    if (!runDiffusionCapacitance({} as never).ok)
      expect(runDiffusionCapacitance({} as never).error.issues[0].code).toBe(
        "invalid_field",
      );
  });

  it("rejects wrong type inputs", () => {
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: "1" as never,
        lifetimeNs: 100,
      }).ok,
    ).toBe(false);
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: "100" as never,
      }).ok,
    ).toBe(false);
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 100,
        idealityFactor: "1" as never,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDiffusionCapacitance({
        forwardCurrentMa: "1" as unknown as number,
        lifetimeNs: 100,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown fields", () => {
    const unknown = runDiffusionCapacitance({
      forwardCurrentMa: 1,
      lifetimeNs: 100,
      extra: 1,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runDiffusionCapacitance(null as never).ok).toBe(false);
    if (!runDiffusionCapacitance(null as never).ok)
      expect(runDiffusionCapacitance(null as never).error.issues[0].code).toBe(
        "object_required",
      );
    expect(runDiffusionCapacitance([] as never).ok).toBe(false);
    expect(runDiffusionCapacitance(42 as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDiffusionCapacitance({
          forwardCurrentMa: bad,
          lifetimeNs: 100,
        }).ok,
      ).toBe(false);
      expect(
        runDiffusionCapacitance({
          forwardCurrentMa: 1,
          lifetimeNs: bad,
        }).ok,
      ).toBe(false);
      expect(
        runDiffusionCapacitance({
          forwardCurrentMa: 1,
          lifetimeNs: 100,
          idealityFactor: bad,
        }).ok,
      ).toBe(false);
      expect(
        runDiffusionCapacitance({
          forwardCurrentMa: 1,
          lifetimeNs: 100,
          temperatureK: bad,
        }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDiffusionCapacitance>[0];
      field: string;
    }> = [
      {
        input: { forwardCurrentMa: Number.NaN, lifetimeNs: 100 },
        field: "forwardCurrentMa",
      },
      {
        input: { forwardCurrentMa: 1, lifetimeNs: Number.NaN },
        field: "lifetimeNs",
      },
      {
        input: {
          forwardCurrentMa: 1,
          lifetimeNs: 100,
          idealityFactor: Number.NaN,
        },
        field: "idealityFactor",
      },
      {
        input: {
          forwardCurrentMa: 1,
          lifetimeNs: 100,
          temperatureK: Number.NaN,
        },
        field: "temperatureK",
      },
      {
        input: { forwardCurrentMa: Number.POSITIVE_INFINITY, lifetimeNs: 100 },
        field: "forwardCurrentMa",
      },
      {
        input: { forwardCurrentMa: 1, lifetimeNs: Number.POSITIVE_INFINITY },
        field: "lifetimeNs",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDiffusionCapacitance(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: negative current, zero/negative lifetime, sub-unity ideality, non-positive temperature", () => {
    expect(
      runDiffusionCapacitance({ forwardCurrentMa: -1, lifetimeNs: 100 }).ok,
    ).toBe(false);
    expect(
      runDiffusionCapacitance({ forwardCurrentMa: 1, lifetimeNs: 0 }).ok,
    ).toBe(false);
    expect(
      runDiffusionCapacitance({ forwardCurrentMa: 1, lifetimeNs: -10 }).ok,
    ).toBe(false);
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: 1,
        idealityFactor: 0.5,
        lifetimeNs: 100,
      }).ok,
    ).toBe(false);
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 100,
        temperatureK: 0,
      }).ok,
    ).toBe(false);
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 100,
        temperatureK: -10,
      }).ok,
    ).toBe(false);
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 100,
        idealityFactor: 0.999,
      }).ok,
    ).toBe(false);

    let err: unknown = null;
    try {
      calculateDiffusionCapacitance({
        forwardCurrentMa: -1,
        lifetimeNs: 100,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_current");
    err = null;
    try {
      calculateDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 0,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_lifetime");
    err = null;
    try {
      calculateDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 100,
        idealityFactor: 0.5,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_ideality");
    expect((err as { field: string }).field).toBe("idealityFactor");
    err = null;
    try {
      calculateDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 100,
        temperatureK: 0,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_temperature");
  });

  it("rejects sub-unity ideality through execution with field code", () => {
    expect(
      runDiffusionCapacitance({
        forwardCurrentMa: 1,
        idealityFactor: 0.5,
        lifetimeNs: 100,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDiffusionCapacitance({
        forwardCurrentMa: 1,
        idealityFactor: 0.5,
        lifetimeNs: 100,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("idealityFactor");
    expect((err as { code: string }).code).toBe("invalid_ideality");
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateDiffusionCapacitance(diffusionCapacitanceExample.input)
        .capacitanceNanoF,
    ).toBe(diffusionCapacitanceExample.output.capacitanceNanoF);
    expect(
      calculateDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 100,
        idealityFactor: 1,
        temperatureK: 300,
      }).capacitanceNanoF,
    ).toBe(diffusionCapacitanceExample.output.capacitanceNanoF);
    expect(() =>
      calculateDiffusionCapacitance({
        forwardCurrentMa: 1,
        lifetimeNs: 0,
        idealityFactor: 1,
      }),
    ).toThrow();
    expect(() =>
      calculateDiffusionCapacitance({
        forwardCurrentMa: Number.NaN,
        lifetimeNs: 100,
      }),
    ).toThrow();
  });

  it("preserves properties: linear with I and tau, inverse with n and T, monotonic", () => {
    const base = calculateDiffusionCapacitance({
      forwardCurrentMa: 1,
      idealityFactor: 1,
      lifetimeNs: 100,
    }).capacitanceNanoF;
    const doubleI = calculateDiffusionCapacitance({
      forwardCurrentMa: 2,
      idealityFactor: 1,
      lifetimeNs: 100,
    }).capacitanceNanoF;
    expect(doubleI).toBeCloseTo(base * 2, 12);
    const doubleTau = calculateDiffusionCapacitance({
      forwardCurrentMa: 1,
      idealityFactor: 1,
      lifetimeNs: 200,
    }).capacitanceNanoF;
    expect(doubleTau).toBeCloseTo(base * 2, 12);

    const doubleIdeality = calculateDiffusionCapacitance({
      forwardCurrentMa: 1,
      idealityFactor: 2,
      lifetimeNs: 100,
    }).capacitanceNanoF;
    expect(doubleIdeality).toBeCloseTo(base / 2, 12);

    const doubleTemp = calculateDiffusionCapacitance({
      forwardCurrentMa: 1,
      idealityFactor: 1,
      lifetimeNs: 100,
      temperatureK: 600,
    }).capacitanceNanoF;
    expect(doubleTemp).toBeCloseTo(base / 2, 12);

    // monotonic
    const low = calculateDiffusionCapacitance({
      forwardCurrentMa: 0.5,
      lifetimeNs: 50,
    }).capacitanceNanoF;
    const high = calculateDiffusionCapacitance({
      forwardCurrentMa: 2,
      lifetimeNs: 200,
    }).capacitanceNanoF;
    expect(high).toBeGreaterThan(low);

    // inverse: I = C*n*Vt / tau
    const k = 1.380649e-23,
      q = 1.602176634e-19,
      T = 300;
    const Vt = (k * T) / q;
    const tau = 100e-9;
    const recoveredI = (base * 1e-9 * 1 * Vt) / tau;
    expect(recoveredI * 1e3).toBeCloseTo(1, 12);
  });

  it("handles extremes without -0, overflow, and preserves full precision", () => {
    const huge = calculateDiffusionCapacitance({
      forwardCurrentMa: 1e6,
      lifetimeNs: 1e6,
      idealityFactor: 1,
      temperatureK: 300,
    });
    expect(Number.isFinite(huge.capacitanceNanoF)).toBe(true);

    const smallest = calculateDiffusionCapacitance({
      forwardCurrentMa: Number.MIN_VALUE,
      lifetimeNs: 100,
    });
    expect(Number.isFinite(smallest.capacitanceNanoF)).toBe(true);
    expect(smallest.capacitanceNanoF).toBeGreaterThan(0);

    // overflow should throw numeric_overflow
    expect(() =>
      calculateDiffusionCapacitance({
        forwardCurrentMa: 1e308,
        lifetimeNs: 1e308,
        idealityFactor: 1,
        temperatureK: 1e-308,
      }),
    ).toThrow();

    const direct = calculateDiffusionCapacitance(
      diffusionCapacitanceExample.input,
    ).capacitanceNanoF;
    const viaRunner = outputOf(
      runDiffusionCapacitance(diffusionCapacitanceExample.input),
    ).capacitanceNanoF;
    expect(direct).toBe(viaRunner);
    expect(direct).toBe(diffusionCapacitanceExample.output.capacitanceNanoF);
    expect(direct.toString()).not.toBe("3.86817270718");
  });
});
