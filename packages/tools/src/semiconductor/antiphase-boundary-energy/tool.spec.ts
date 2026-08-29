import { describe, expect, it } from "vitest";
import {
  calculateAntiphaseBoundaryEnergy,
  antiphaseBoundaryEnergyExample,
  runAntiphaseBoundaryEnergy,
} from "./tool.js";

describe("APB Energy Calculator", () => {
  it("reproduces its canonical example exactly", () =>
    expect(
      runAntiphaseBoundaryEnergy(antiphaseBoundaryEnergyExample.input),
    ).toEqual({
      ok: true,
      output: antiphaseBoundaryEnergyExample.output,
    }));

  it("applies both defaults to about 54.474 mJ/m² with full precision", () => {
    const result = runAntiphaseBoundaryEnergy({});
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("expected success");
    expect(result.output.boundaryEnergyMJPerM2).toBeCloseTo(54.474005556, 12);
    // exact default product
    expect(result.output.boundaryEnergyMJPerM2).toBe(0.05 * 6.8 * 160.2176634);
    expect(
      calculateAntiphaseBoundaryEnergy({}).boundaryEnergyMJPerM2,
    ).toBeCloseTo(54.474005556, 12);
  });

  it("scales linearly with APB energy per atom", () => {
    expect(
      runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.12,
        atomDensityPerNm2: 6.8,
      }),
    ).toEqual({
      ok: true,
      output: { boundaryEnergyMJPerM2: 130.73761333439998 },
    });
    expect(
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.12,
        atomDensityPerNm2: 6.8,
      }).boundaryEnergyMJPerM2,
    ).toBeCloseTo(0.12 * 6.8 * 160.2176634, 12);
  });

  it("scales linearly with atom density", () =>
    expect(
      runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.05,
        atomDensityPerNm2: 8,
      }),
    ).toEqual({
      ok: true,
      output: { boundaryEnergyMJPerM2: 64.08706536 },
    }));

  it("returns zero energy for zero APB energy and normalizes -0", () => {
    expect(
      runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0,
        atomDensityPerNm2: 6.8,
      }),
    ).toEqual({
      ok: true,
      output: { boundaryEnergyMJPerM2: 0 },
    });
    // runner -0 normalization
    const minusZeroRunner = runAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: -0,
      atomDensityPerNm2: 6.8,
    });
    expect(minusZeroRunner.ok).toBe(true);
    if (!minusZeroRunner.ok) throw new Error("expected success");
    expect(minusZeroRunner.output.boundaryEnergyMJPerM2).toBe(0);
    expect(Object.is(minusZeroRunner.output.boundaryEnergyMJPerM2, -0)).toBe(
      false,
    );
    expect(1 / (minusZeroRunner.output.boundaryEnergyMJPerM2 as number)).toBe(
      Infinity,
    );

    expect(
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0,
        atomDensityPerNm2: 6.8,
      }).boundaryEnergyMJPerM2,
    ).toBe(0);
    expect(
      Object.is(
        calculateAntiphaseBoundaryEnergy({
          apbEnergyEvPerAtom: -0,
          atomDensityPerNm2: 6.8,
        }).boundaryEnergyMJPerM2,
        -0,
      ),
    ).toBe(false);
  });

  it("accepts fractional and small positive energies", () => {
    expect(
      runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.001,
        atomDensityPerNm2: 1,
      }).ok,
    ).toBe(true);
    if (
      !runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.001,
        atomDensityPerNm2: 1,
      }).ok
    )
      throw new Error("expected success");
    const r = runAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 0.001,
      atomDensityPerNm2: 1,
    });
    if (r.ok)
      expect(r.output.boundaryEnergyMJPerM2).toBeCloseTo(0.1602176634, 12);
  });

  it("rejects negative APB energy", () => {
    const runner = runAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: -0.05,
      atomDensityPerNm2: 6.8,
    });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(["invalid_field", "invalid_apb_energy"]).toContain(
      runner.error.issues[0].code,
    );
    expect(runner.error.issues[0].field).toBe("apbEnergyEvPerAtom");

    let directErr: unknown = null;
    try {
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: -0.05,
        atomDensityPerNm2: 6.8,
      });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("invalid_apb_energy");
  });

  it("rejects zero and negative atom density", () => {
    for (const bad of [0, -6.8, -0, -1e-9]) {
      const r = runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.05,
        atomDensityPerNm2: bad,
      });
      expect(r.ok).toBe(false);
      if (r.ok) throw new Error("expected failure");
      expect(["invalid_field", "invalid_atom_density"]).toContain(
        r.error.issues[0].code,
      );
      expect(r.error.issues[0].field).toBe("atomDensityPerNm2");
    }
    let e: unknown = null;
    try {
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.05,
        atomDensityPerNm2: 0,
      });
    } catch (err) {
      e = err;
    }
    expect((e as { code: string }).code).toBe("invalid_atom_density");
  });

  it("direct calculator rejects non-finite inputs", () => {
    const cases: Array<{
      input: Parameters<typeof calculateAntiphaseBoundaryEnergy>[0];
      field: string;
    }> = [
      {
        input: {
          apbEnergyEvPerAtom: Number.NaN,
          atomDensityPerNm2: 6.8,
        },
        field: "apbEnergyEvPerAtom",
      },
      {
        input: {
          apbEnergyEvPerAtom: Number.POSITIVE_INFINITY,
          atomDensityPerNm2: 6.8,
        },
        field: "apbEnergyEvPerAtom",
      },
      {
        input: {
          apbEnergyEvPerAtom: Number.NEGATIVE_INFINITY,
          atomDensityPerNm2: 6.8,
        },
        field: "apbEnergyEvPerAtom",
      },
      {
        input: {
          apbEnergyEvPerAtom: 0.05,
          atomDensityPerNm2: Number.NaN,
        },
        field: "atomDensityPerNm2",
      },
      {
        input: {
          apbEnergyEvPerAtom: 0.05,
          atomDensityPerNm2: Number.POSITIVE_INFINITY,
        },
        field: "atomDensityPerNm2",
      },
      {
        input: {
          apbEnergyEvPerAtom: 0.05,
          atomDensityPerNm2: Number.NEGATIVE_INFINITY,
        },
        field: "atomDensityPerNm2",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateAntiphaseBoundaryEnergy(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
    expect(
      runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: Number.NaN,
        atomDensityPerNm2: 6.8,
      }).ok,
    ).toBe(false);
    expect(
      runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.05,
        atomDensityPerNm2: Number.POSITIVE_INFINITY,
      }).ok,
    ).toBe(false);
  });

  it("reports numeric overflow against an input field", () => {
    let directErr: unknown = null;
    try {
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: Number.MAX_VALUE,
        atomDensityPerNm2: Number.MAX_VALUE,
      });
    } catch (e) {
      directErr = e;
    }
    expect(directErr).not.toBeNull();
    expect((directErr as { code: string }).code).toBe("numeric_overflow");
    expect((directErr as { field: string }).field).toBe("atomDensityPerNm2");

    const runner = runAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: Number.MAX_VALUE,
      atomDensityPerNm2: Number.MAX_VALUE,
    });
    expect(runner.ok).toBe(false);
    if (runner.ok) throw new Error("expected failure");
    expect(runner.error.issues[0].code).toBe("numeric_overflow");
  });

  it("handles very small and large inputs without -0 or NaN", () => {
    const tiny = runAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: Number.MIN_VALUE,
      atomDensityPerNm2: Number.MIN_VALUE,
    });
    if (tiny.ok) {
      const v = (tiny.output as { boundaryEnergyMJPerM2: number })
        .boundaryEnergyMJPerM2;
      expect(Number.isFinite(v)).toBe(true);
      expect(Object.is(v, -0)).toBe(false);
      expect(v).toBeGreaterThanOrEqual(0);
    } else {
      expect(tiny.error.issues[0].code).toBe("numeric_underflow");
    }

    const hugeButFinite = runAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 1e100,
      atomDensityPerNm2: 1e100,
    });
    if (hugeButFinite.ok) {
      expect(
        Number.isFinite(
          (hugeButFinite.output as { boundaryEnergyMJPerM2: number })
            .boundaryEnergyMJPerM2,
        ),
      ).toBe(true);
    } else {
      expect(hugeButFinite.error.issues[0].code).toBe("numeric_overflow");
    }
  });

  it("rejects missing required type, wrong type, unknown fields, and non-object", () => {
    // missing is okay due to defaults, but wrong type should fail
    expect(
      runAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: "low" as never,
        atomDensityPerNm2: 6.8,
      }).ok,
    ).toBe(false);
    const unknown = runAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 0.05,
      atomDensityPerNm2: 6.8,
      extra: 1,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
    const nonObject = runAntiphaseBoundaryEnergy(null as never);
    expect(nonObject.ok).toBe(false);
    expect(runAntiphaseBoundaryEnergy(42 as never).ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
  });

  it("preserves properties: linear scaling, double density doubles energy, inverse, monotonic", () => {
    const base = calculateAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 0.05,
      atomDensityPerNm2: 6.8,
    }).boundaryEnergyMJPerM2;

    const doubledEnergy = calculateAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 0.1,
      atomDensityPerNm2: 6.8,
    }).boundaryEnergyMJPerM2;
    expect(doubledEnergy).toBeCloseTo(base * 2, 12);

    const doubledDensity = calculateAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 0.05,
      atomDensityPerNm2: 13.6,
    }).boundaryEnergyMJPerM2;
    expect(doubledDensity).toBeCloseTo(base * 2, 12);

    const bothDoubled = calculateAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 0.1,
      atomDensityPerNm2: 13.6,
    }).boundaryEnergyMJPerM2;
    expect(bothDoubled).toBeCloseTo(base * 4, 12);

    // inverse: recover apbEnergy from boundaryEnergy
    const recoveredApb = base / (6.8 * 160.2176634);
    expect(recoveredApb).toBeCloseTo(0.05, 12);

    // monotonic
    const low = calculateAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 0.01,
      atomDensityPerNm2: 1,
    }).boundaryEnergyMJPerM2;
    const high = calculateAntiphaseBoundaryEnergy({
      apbEnergyEvPerAtom: 0.1,
      atomDensityPerNm2: 10,
    }).boundaryEnergyMJPerM2;
    expect(high).toBeGreaterThan(low);
  });

  it("direct calculator mirrors runner for valid, zero, and invalid inputs", () => {
    expect(
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0.05,
        atomDensityPerNm2: 6.8,
      }).boundaryEnergyMJPerM2,
    ).toBeCloseTo(54.474005556, 12);
    expect(
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: 0,
        atomDensityPerNm2: 6.8,
      }).boundaryEnergyMJPerM2,
    ).toBe(0);
    expect(() =>
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: -0.05,
        atomDensityPerNm2: 6.8,
      }),
    ).toThrow();
    expect(() =>
      calculateAntiphaseBoundaryEnergy({
        apbEnergyEvPerAtom: Number.NaN,
        atomDensityPerNm2: 6.8,
      }),
    ).toThrow();
  });
});
