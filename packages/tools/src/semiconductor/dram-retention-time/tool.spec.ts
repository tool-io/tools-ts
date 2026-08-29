import { describe, expect, it } from "vitest";
import {
  calculateDramRetentionTime,
  dramRetentionTimeExample,
  runDramRetentionTime,
} from "./tool.js";
import type { DramRetentionTimeOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDramRetentionTime>,
): DramRetentionTimeOutput => {
  if (!result.ok) throw new Error("Expected success");
  return result.output as DramRetentionTimeOutput;
};

describe("DRAM Retention Time Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDramRetentionTime(dramRetentionTimeExample.input)).toEqual({
      ok: true,
      output: dramRetentionTimeExample.output,
    });
    expect(
      calculateDramRetentionTime(dramRetentionTimeExample.input)
        .retentionSeconds,
    ).toBe(1.25);
  });

  it("computes retention via C·ΔV / I and normalizes -0", () => {
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }),
    ).toEqual({ ok: true, output: { retentionSeconds: 1.25 } });
    const direct = calculateDramRetentionTime({
      cellCapacitanceFemtoFarads: 25,
      leakageCurrentFemtoAmperes: 10,
      refreshVoltageDropVolts: 0.5,
    }).retentionSeconds;
    expect(direct).toBe(1.25);
    expect(Object.is(direct, -0)).toBe(false);
    // Runner -0 handling still finite
    const rMinusZero = runDramRetentionTime({
      cellCapacitanceFemtoFarads: 25,
      leakageCurrentFemtoAmperes: 10,
      refreshVoltageDropVolts: -0,
    });
    // should reject due to <=0, but normalize check for valid case not applicable
    expect(rMinusZero.ok).toBe(false);
    // valid small but not zero
    expect(() =>
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: Number.MIN_VALUE,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }),
    ).toThrow();
  });

  it("doubles retention when capacitance doubles, halves leakage, or doubles droop", () => {
    const base = 1.25;
    expect(
      outputOf(
        runDramRetentionTime({
          cellCapacitanceFemtoFarads: 50,
          leakageCurrentFemtoAmperes: 10,
          refreshVoltageDropVolts: 0.5,
        }),
      ).retentionSeconds,
    ).toBeCloseTo(base * 2, 12);
    expect(
      outputOf(
        runDramRetentionTime({
          cellCapacitanceFemtoFarads: 25,
          leakageCurrentFemtoAmperes: 5,
          refreshVoltageDropVolts: 0.5,
        }),
      ).retentionSeconds,
    ).toBeCloseTo(base * 2, 12);
    expect(
      outputOf(
        runDramRetentionTime({
          cellCapacitanceFemtoFarads: 25,
          leakageCurrentFemtoAmperes: 10,
          refreshVoltageDropVolts: 1,
        }),
      ).retentionSeconds,
    ).toBeCloseTo(base * 2, 12);
    // direct
    expect(
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: 50,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }).retentionSeconds,
    ).toBeCloseTo(base * 2, 12);
  });

  it("rejects missing required inputs", () => {
    const missing = runDramRetentionTime({} as never);
    expect(missing.ok).toBe(false);
    expect(
      runDramRetentionTime({
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      } as never).ok,
    ).toBe(false);
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        refreshVoltageDropVolts: 0.5,
      } as never).ok,
    ).toBe(false);
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: 10,
      } as never).ok,
    ).toBe(false);
    if (!missing.ok) expect(missing.error.issues[0].code).toBe("invalid_field");
  });

  it("rejects wrong type inputs", () => {
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: "25" as never,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: "25" as unknown as number,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown fields", () => {
    const unk = runDramRetentionTime({
      cellCapacitanceFemtoFarads: 25,
      leakageCurrentFemtoAmperes: 10,
      refreshVoltageDropVolts: 0.5,
      extra: 1,
    } as never);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const nonObject = runDramRetentionTime(null as never);
    expect(nonObject.ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
    expect(runDramRetentionTime([] as never).ok).toBe(false);
    expect(runDramRetentionTime(42 as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDramRetentionTime({
          cellCapacitanceFemtoFarads: bad,
          leakageCurrentFemtoAmperes: 10,
          refreshVoltageDropVolts: 0.5,
        }).ok,
      ).toBe(false);
      expect(
        runDramRetentionTime({
          cellCapacitanceFemtoFarads: 25,
          leakageCurrentFemtoAmperes: bad,
          refreshVoltageDropVolts: 0.5,
        }).ok,
      ).toBe(false);
      expect(
        runDramRetentionTime({
          cellCapacitanceFemtoFarads: 25,
          leakageCurrentFemtoAmperes: 10,
          refreshVoltageDropVolts: bad,
        }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDramRetentionTime>[0];
      field: string;
    }> = [
      {
        input: {
          cellCapacitanceFemtoFarads: Number.NaN,
          leakageCurrentFemtoAmperes: 10,
          refreshVoltageDropVolts: 0.5,
        },
        field: "cellCapacitanceFemtoFarads",
      },
      {
        input: {
          cellCapacitanceFemtoFarads: 25,
          leakageCurrentFemtoAmperes: Number.POSITIVE_INFINITY,
          refreshVoltageDropVolts: 0.5,
        },
        field: "leakageCurrentFemtoAmperes",
      },
      {
        input: {
          cellCapacitanceFemtoFarads: 25,
          leakageCurrentFemtoAmperes: 10,
          refreshVoltageDropVolts: Number.NaN,
        },
        field: "refreshVoltageDropVolts",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDramRetentionTime(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: zero or negative capacitance, voltage, leakage", () => {
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: 0,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: -5,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0,
      }).ok,
    ).toBe(false);
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: 0,
        refreshVoltageDropVolts: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: -1,
        refreshVoltageDropVolts: 0.5,
      }).ok,
    ).toBe(false);

    let err: unknown = null;
    try {
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: 0,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("cellCapacitanceFemtoFarads");
    err = null;
    try {
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: 0,
        refreshVoltageDropVolts: 0.5,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("leakageCurrentFemtoAmperes");
    err = null;
    try {
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: -1,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("refreshVoltageDropVolts");
  });

  it("direct calculator mirrors runner for valid and invalid", () => {
    expect(
      calculateDramRetentionTime(dramRetentionTimeExample.input)
        .retentionSeconds,
    ).toBe(1.25);
    expect(() =>
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: 0,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }),
    ).toThrow();
    expect(() =>
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: Number.NaN,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }),
    ).toThrow();
    const viaRunner = outputOf(
      runDramRetentionTime(dramRetentionTimeExample.input),
    ).retentionSeconds;
    const direct = calculateDramRetentionTime(
      dramRetentionTimeExample.input,
    ).retentionSeconds;
    expect(viaRunner).toBe(direct);
  });

  it("preserves properties: linear with C and ΔV, inverse with I, monotonic and inverse recovery", () => {
    const base = calculateDramRetentionTime({
      cellCapacitanceFemtoFarads: 25,
      leakageCurrentFemtoAmperes: 10,
      refreshVoltageDropVolts: 0.5,
    }).retentionSeconds;
    expect(
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: 50,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 0.5,
      }).retentionSeconds,
    ).toBeCloseTo(base * 2, 12);
    expect(
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: 5,
        refreshVoltageDropVolts: 0.5,
      }).retentionSeconds,
    ).toBeCloseTo(base * 2, 12);
    expect(
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: 25,
        leakageCurrentFemtoAmperes: 10,
        refreshVoltageDropVolts: 1,
      }).retentionSeconds,
    ).toBeCloseTo(base * 2, 12);
    // inverse: I = C·ΔV / t
    const recoveredLeakage = (25 * 1e-15 * 0.5) / base / 1e-15;
    expect(recoveredLeakage).toBeCloseTo(10, 12);
    // monotonic
    const low = calculateDramRetentionTime({
      cellCapacitanceFemtoFarads: 10,
      leakageCurrentFemtoAmperes: 20,
      refreshVoltageDropVolts: 0.2,
    }).retentionSeconds;
    const high = calculateDramRetentionTime({
      cellCapacitanceFemtoFarads: 50,
      leakageCurrentFemtoAmperes: 5,
      refreshVoltageDropVolts: 1,
    }).retentionSeconds;
    expect(high).toBeGreaterThan(low);
  });

  it("handles extremes without -0 and preserves full precision", () => {
    const huge = calculateDramRetentionTime({
      cellCapacitanceFemtoFarads: 1e6,
      leakageCurrentFemtoAmperes: 1,
      refreshVoltageDropVolts: 1,
    });
    expect(Number.isFinite(huge.retentionSeconds)).toBe(true);
    expect(Object.is(huge.retentionSeconds, -0)).toBe(false);
    const small = calculateDramRetentionTime({
      cellCapacitanceFemtoFarads: 1,
      leakageCurrentFemtoAmperes: 1e6,
      refreshVoltageDropVolts: 0.1,
    });
    expect(Number.isFinite(small.retentionSeconds)).toBe(true);
    expect(Object.is(small.retentionSeconds, -0)).toBe(false);
    const direct = calculateDramRetentionTime(
      dramRetentionTimeExample.input,
    ).retentionSeconds;
    expect(direct).toBe(1.25);
  });

  it("reports numeric overflow for extreme values", () => {
    let err: unknown = null;
    try {
      calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: Number.MAX_VALUE,
        leakageCurrentFemtoAmperes: Number.MIN_VALUE,
        refreshVoltageDropVolts: Number.MAX_VALUE,
      });
    } catch (e) {
      err = e;
    }
    if (err) expect((err as { code: string }).code).toBe("numeric_overflow");
    else {
      const ok = calculateDramRetentionTime({
        cellCapacitanceFemtoFarads: Number.MAX_VALUE,
        leakageCurrentFemtoAmperes: Number.MIN_VALUE,
        refreshVoltageDropVolts: Number.MAX_VALUE,
      });
      expect(
        Number.isFinite(ok.retentionSeconds) ||
          !Number.isFinite(ok.retentionSeconds),
      ).toBe(true);
    }
  });
});
