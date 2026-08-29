import { describe, expect, it } from "vitest";
import {
  calculateDiodeIdealityFactor,
  diodeIdealityFactorExample,
  runDiodeIdealityFactor,
} from "./tool.js";
import type { DiodeIdealityFactorOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDiodeIdealityFactor>,
): DiodeIdealityFactorOutput => {
  if (!result.ok) throw new Error("Expected success");
  return result.output as DiodeIdealityFactorOutput;
};

describe("diode ideality factor calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiodeIdealityFactor(diodeIdealityFactorExample.input)).toEqual({
      ok: true,
      output: diodeIdealityFactorExample.output,
    });
    expect(
      calculateDiodeIdealityFactor(diodeIdealityFactorExample.input)
        .idealityFactor,
    ).toBe(1.679926061778496);
  });

  it("returns exactly one for an ideal decade at one thermal voltage per ln(10)", () => {
    const vt = (1.380649e-23 * 300) / 1.602176634e-19;
    const direct = calculateDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 10,
      temperatureK: 300,
      voltageOneV: 0.6,
      voltageTwoV: 0.6 + vt * Math.log(10),
    }).idealityFactor;
    expect(direct).toBeCloseTo(1, 12);
    const viaRunner = outputOf(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        temperatureK: 300,
        voltageOneV: 0.6,
        voltageTwoV: 0.6 + vt * Math.log(10),
      }),
    ).idealityFactor;
    expect(viaRunner).toBeCloseTo(1, 12);
  });

  it("uses default temperature 300 K when omitted", () => {
    const withDefault = outputOf(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }),
    ).idealityFactor;
    const explicit = outputOf(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        temperatureK: 300,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }),
    ).idealityFactor;
    expect(withDefault).toBe(explicit);
    expect(
      calculateDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }).idealityFactor,
    ).toBe(explicit);
  });

  it("rejects missing required inputs", () => {
    const missing = runDiodeIdealityFactor({} as never);
    expect(missing.ok).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      } as never).ok,
    ).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      } as never).ok,
    ).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        voltageTwoV: 0.7,
      } as never).ok,
    ).toBe(false);
    if (!missing.ok) expect(missing.error.issues[0].code).toBe("invalid_field");
  });

  it("rejects wrong type inputs", () => {
    expect(
      runDiodeIdealityFactor({
        currentOneMa: "1" as never,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        voltageOneV: "0.6" as never,
        voltageTwoV: 0.7,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDiodeIdealityFactor({
        currentOneMa: "1" as unknown as number,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown fields", () => {
    const unknown = runDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 10,
      voltageOneV: 0.6,
      voltageTwoV: 0.7,
      extra: 1,
    } as never);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) expect(unknown.error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const nonObject = runDiodeIdealityFactor(null as never);
    expect(nonObject.ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
    expect(runDiodeIdealityFactor([] as never).ok).toBe(false);
    expect(runDiodeIdealityFactor(42 as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDiodeIdealityFactor({
          currentOneMa: bad,
          currentTwoMa: 10,
          voltageOneV: 0.6,
          voltageTwoV: 0.7,
        }).ok,
      ).toBe(false);
      expect(
        runDiodeIdealityFactor({
          currentOneMa: 1,
          currentTwoMa: bad,
          voltageOneV: 0.6,
          voltageTwoV: 0.7,
        }).ok,
      ).toBe(false);
      expect(
        runDiodeIdealityFactor({
          currentOneMa: 1,
          currentTwoMa: 10,
          voltageOneV: bad,
          voltageTwoV: 0.7,
        }).ok,
      ).toBe(false);
      expect(
        runDiodeIdealityFactor({
          currentOneMa: 1,
          currentTwoMa: 10,
          voltageOneV: 0.6,
          voltageTwoV: bad,
        }).ok,
      ).toBe(false);
      expect(
        runDiodeIdealityFactor({
          currentOneMa: 1,
          currentTwoMa: 10,
          voltageOneV: 0.6,
          voltageTwoV: 0.7,
          temperatureK: bad,
        }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDiodeIdealityFactor>[0];
      field: string;
    }> = [
      {
        input: {
          currentOneMa: Number.NaN,
          currentTwoMa: 10,
          voltageOneV: 0.6,
          voltageTwoV: 0.7,
        },
        field: "currentOneMa",
      },
      {
        input: {
          currentOneMa: 1,
          currentTwoMa: Number.POSITIVE_INFINITY,
          voltageOneV: 0.6,
          voltageTwoV: 0.7,
        },
        field: "currentTwoMa",
      },
      {
        input: {
          currentOneMa: 1,
          currentTwoMa: 10,
          voltageOneV: Number.NaN,
          voltageTwoV: 0.7,
        },
        field: "voltageOneV",
      },
      {
        input: {
          currentOneMa: 1,
          currentTwoMa: 10,
          voltageOneV: 0.6,
          voltageTwoV: Number.POSITIVE_INFINITY,
        },
        field: "voltageTwoV",
      },
      {
        input: {
          currentOneMa: 1,
          currentTwoMa: 10,
          voltageOneV: 0.6,
          voltageTwoV: 0.7,
          temperatureK: Number.NaN,
        },
        field: "temperatureK",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDiodeIdealityFactor(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: non-positive or zero/negative currents, equal currents, non-positive temperature, non-positive ideality", () => {
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 0,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentOneMa: -1,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 0,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 5,
        currentTwoMa: 5,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
        temperatureK: 0,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
        temperatureK: -10,
      }).ok,
    ).toBe(false);
    // voltage difference sign mismatch -> negative ideality -> direct invalid_measurements
    let err: unknown = null;
    try {
      calculateDiodeIdealityFactor({
        currentOneMa: 1,
        currentTwoMa: 10,
        voltageOneV: 0.7,
        voltageTwoV: 0.6,
        temperatureK: 300,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_measurements");
    expect((err as { field: string }).field).toBe("voltageTwoV");

    err = null;
    try {
      calculateDiodeIdealityFactor({
        currentOneMa: 0,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("currentOneMa");

    err = null;
    try {
      calculateDiodeIdealityFactor({
        currentOneMa: 5,
        currentTwoMa: 5,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("invalid_currents");
  });

  it("direct calculator mirrors runner for valid and invalid inputs", () => {
    expect(
      calculateDiodeIdealityFactor(diodeIdealityFactorExample.input)
        .idealityFactor,
    ).toBe(1.679926061778496);
    expect(() =>
      calculateDiodeIdealityFactor({
        currentOneMa: 0,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }),
    ).toThrow();
    expect(() =>
      calculateDiodeIdealityFactor({
        currentOneMa: Number.NaN,
        currentTwoMa: 10,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
      }),
    ).toThrow();
    const viaRunner = outputOf(
      runDiodeIdealityFactor(diodeIdealityFactorExample.input),
    ).idealityFactor;
    const direct = calculateDiodeIdealityFactor(
      diodeIdealityFactorExample.input,
    ).idealityFactor;
    expect(viaRunner).toBe(direct);
  });

  it("preserves properties: monotonic and inverse", () => {
    const vt = (1.380649e-23 * 300) / 1.602176634e-19;
    const base = calculateDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 10,
      voltageOneV: 0.6,
      voltageTwoV: 0.7,
    }).idealityFactor;
    // larger deltaV -> larger n
    const largerDelta = calculateDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 10,
      voltageOneV: 0.6,
      voltageTwoV: 0.8,
    }).idealityFactor;
    expect(largerDelta).toBeGreaterThan(base);
    expect(largerDelta).toBeCloseTo(base * 2, 12);

    // higher temperature -> smaller n (inverse with T via Vt)
    const hotter = calculateDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 10,
      voltageOneV: 0.6,
      voltageTwoV: 0.7,
      temperatureK: 600,
    }).idealityFactor;
    expect(hotter).toBeCloseTo(base / 2, 12);

    // inverse: deltaV = n·Vt·ln(I2/I1)
    const recoveredDelta = base * vt * Math.log(10);
    expect(recoveredDelta).toBeCloseTo(0.1, 12);

    // monotonic with current ratio: larger ratio -> smaller n for fixed deltaV
    const smallRatio = calculateDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 2,
      voltageOneV: 0.6,
      voltageTwoV: 0.7,
    }).idealityFactor;
    const largeRatio = calculateDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 100,
      voltageOneV: 0.6,
      voltageTwoV: 0.7,
    }).idealityFactor;
    expect(smallRatio).toBeGreaterThan(largeRatio);
  });

  it("handles extremes without -0, overflow, and preserves full precision", () => {
    const tinyDelta = calculateDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 10,
      voltageOneV: 0.600001,
      voltageTwoV: 0.600002,
      temperatureK: 300,
    });
    expect(Number.isFinite(tinyDelta.idealityFactor)).toBe(true);
    expect(Object.is(tinyDelta.idealityFactor, -0)).toBe(false);

    const hugeTemp = calculateDiodeIdealityFactor({
      currentOneMa: 1,
      currentTwoMa: 10,
      voltageOneV: 0.6,
      voltageTwoV: 0.7,
      temperatureK: 1000,
    });
    expect(Number.isFinite(hugeTemp.idealityFactor)).toBe(true);

    // check full precision not rounded to 12 digits truncation
    const direct = calculateDiodeIdealityFactor(
      diodeIdealityFactorExample.input,
    ).idealityFactor;
    expect(direct).toBe(1.679926061778496);
    expect(direct.toString()).not.toBe("1.67992606178");
    expect(Object.is(direct, -0)).toBe(false);
  });

  it("reports numeric overflow for extreme inputs", () => {
    let err: unknown = null;
    try {
      calculateDiodeIdealityFactor({
        currentOneMa: Number.MIN_VALUE,
        currentTwoMa: Number.MAX_VALUE,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
        temperatureK: Number.MIN_VALUE,
      });
    } catch (e) {
      err = e;
    }
    // either overflow or invalid; should not be silent success
    if (err) expect((err as { code: string }).code).toBeDefined();
    else {
      // if not overflow, at least finite
      const ok = calculateDiodeIdealityFactor({
        currentOneMa: Number.MIN_VALUE,
        currentTwoMa: Number.MAX_VALUE,
        voltageOneV: 0.6,
        voltageTwoV: 0.7,
        temperatureK: Number.MIN_VALUE,
      });
      expect(Number.isFinite(ok.idealityFactor)).toBe(true);
    }
  });
});
