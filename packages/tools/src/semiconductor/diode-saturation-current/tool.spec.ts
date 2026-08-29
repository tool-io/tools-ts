import { describe, expect, it } from "vitest";
import {
  calculateDiodeSaturationCurrent,
  diodeSaturationCurrentExample,
  runDiodeSaturationCurrent,
} from "./tool.js";
import type { DiodeSaturationCurrentOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runDiodeSaturationCurrent>,
): DiodeSaturationCurrentOutput => {
  if (!result.ok) throw new Error("Expected success");
  return result.output as DiodeSaturationCurrentOutput;
};

describe("diode saturation current calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDiodeSaturationCurrent(diodeSaturationCurrentExample.input),
    ).toEqual({
      ok: true,
      output: diodeSaturationCurrentExample.output,
    });
    expect(
      calculateDiodeSaturationCurrent(diodeSaturationCurrentExample.input)
        .saturationCurrentPicoA,
    ).toBe(diodeSaturationCurrentExample.output.saturationCurrentPicoA);
  });

  it("uses defaults for ideality and temperature", () => {
    const withDefaults = outputOf(
      runDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 0.65,
      }),
    ).saturationCurrentPicoA;
    const explicit = outputOf(
      runDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 0.65,
        idealityFactor: 1,
        temperatureK: 300,
      }),
    ).saturationCurrentPicoA;
    expect(withDefaults).toBe(explicit);
    expect(
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 0.65,
      }).saturationCurrentPicoA,
    ).toBe(explicit);
  });

  it("scales the extracted saturation current with ideality", () => {
    const vt = (1.380649e-23 * 300) / 1.602176634e-19;
    const one = calculateDiodeSaturationCurrent({
      forwardCurrentMa: 1,
      forwardVoltageV: 0.12,
      idealityFactor: 1,
      temperatureK: 300,
    }).saturationCurrentPicoA;
    const two = calculateDiodeSaturationCurrent({
      forwardCurrentMa: 1,
      forwardVoltageV: 0.12,
      idealityFactor: 2,
      temperatureK: 300,
    }).saturationCurrentPicoA;
    expect(two / one).toBeCloseTo(
      Math.expm1(0.12 / vt) / Math.expm1(0.12 / (2 * vt)),
      12,
    );
  });

  it("rejects missing required inputs", () => {
    const missing = runDiodeSaturationCurrent({} as never);
    expect(missing.ok).toBe(false);
    expect(
      runDiodeSaturationCurrent({ forwardVoltageV: 0.65 } as never).ok,
    ).toBe(false);
    expect(runDiodeSaturationCurrent({ forwardCurrentMa: 1 } as never).ok).toBe(
      false,
    );
    if (!missing.ok) expect(missing.error.issues[0].code).toBe("invalid_field");
  });

  it("rejects wrong type inputs", () => {
    expect(
      runDiodeSaturationCurrent({
        forwardCurrentMa: "1" as never,
        forwardVoltageV: 0.65,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: "0.65" as never,
      }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: "1" as unknown as number,
        forwardVoltageV: 0.65,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
  });

  it("rejects unknown fields", () => {
    const unk = runDiodeSaturationCurrent({
      forwardCurrentMa: 1,
      forwardVoltageV: 0.65,
      extra: 1,
    } as never);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    const nonObject = runDiodeSaturationCurrent(null as never);
    expect(nonObject.ok).toBe(false);
    if (!nonObject.ok)
      expect(nonObject.error.issues[0].code).toBe("object_required");
    expect(runDiodeSaturationCurrent([] as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runDiodeSaturationCurrent({
          forwardCurrentMa: bad,
          forwardVoltageV: 0.65,
        }).ok,
      ).toBe(false);
      expect(
        runDiodeSaturationCurrent({
          forwardCurrentMa: 1,
          forwardVoltageV: bad,
        }).ok,
      ).toBe(false);
      expect(
        runDiodeSaturationCurrent({
          forwardCurrentMa: 1,
          forwardVoltageV: 0.65,
          idealityFactor: bad,
        }).ok,
      ).toBe(false);
      expect(
        runDiodeSaturationCurrent({
          forwardCurrentMa: 1,
          forwardVoltageV: 0.65,
          temperatureK: bad,
        }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateDiodeSaturationCurrent>[0];
      field: string;
    }> = [
      {
        input: { forwardCurrentMa: Number.NaN, forwardVoltageV: 0.65 },
        field: "forwardCurrentMa",
      },
      {
        input: { forwardCurrentMa: 1, forwardVoltageV: Number.NaN },
        field: "forwardVoltageV",
      },
      {
        input: {
          forwardCurrentMa: 1,
          forwardVoltageV: 0.65,
          idealityFactor: Number.NaN,
        },
        field: "idealityFactor",
      },
      {
        input: {
          forwardCurrentMa: 1,
          forwardVoltageV: 0.65,
          temperatureK: Number.POSITIVE_INFINITY,
        },
        field: "temperatureK",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateDiodeSaturationCurrent(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: non-positive bias, sub-unity ideality, non-positive temperature", () => {
    for (const bad of [
      { forwardCurrentMa: 0, forwardVoltageV: 0.65 },
      { forwardCurrentMa: -1, forwardVoltageV: 0.65 },
      { forwardCurrentMa: 1, forwardVoltageV: 0 },
      { forwardCurrentMa: 1, forwardVoltageV: -1 },
    ])
      expect(runDiodeSaturationCurrent(bad as never).ok).toBe(false);

    expect(
      runDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 0.65,
        idealityFactor: 0.5,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 0.65,
        idealityFactor: 0.999,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 0.65,
        temperatureK: 0,
      }).ok,
    ).toBe(false);
    expect(
      runDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 0.65,
        temperatureK: -10,
      }).ok,
    ).toBe(false);

    let err: unknown = null;
    try {
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: 0,
        forwardVoltageV: 0.65,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("forwardCurrentMa");
    err = null;
    try {
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: -1,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("forwardVoltageV");
    err = null;
    try {
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 0.65,
        idealityFactor: 0.5,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("idealityFactor");
    expect((err as { code: string }).code).toBe("invalid_ideality");
  });

  it("direct calculator mirrors runner for valid and invalid", () => {
    expect(
      calculateDiodeSaturationCurrent(diodeSaturationCurrentExample.input)
        .saturationCurrentPicoA,
    ).toBe(diodeSaturationCurrentExample.output.saturationCurrentPicoA);
    expect(() =>
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: 0,
        forwardVoltageV: 0.65,
      }),
    ).toThrow();
    expect(() =>
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: Number.NaN,
        forwardVoltageV: 0.65,
      }),
    ).toThrow();
    const viaRunner = outputOf(
      runDiodeSaturationCurrent(diodeSaturationCurrentExample.input),
    ).saturationCurrentPicoA;
    const direct = calculateDiodeSaturationCurrent(
      diodeSaturationCurrentExample.input,
    ).saturationCurrentPicoA;
    expect(viaRunner).toBe(direct);
  });

  it("preserves properties: linear with I, inverse exponential with V, monotonic", () => {
    const base = calculateDiodeSaturationCurrent({
      forwardCurrentMa: 1,
      forwardVoltageV: 0.65,
      idealityFactor: 1,
      temperatureK: 300,
    }).saturationCurrentPicoA;
    const doubleI = calculateDiodeSaturationCurrent({
      forwardCurrentMa: 2,
      forwardVoltageV: 0.65,
      idealityFactor: 1,
      temperatureK: 300,
    }).saturationCurrentPicoA;
    expect(doubleI).toBeCloseTo(base * 2, 12);

    // higher V -> smaller Is for fixed I
    const higherV = calculateDiodeSaturationCurrent({
      forwardCurrentMa: 1,
      forwardVoltageV: 0.7,
      idealityFactor: 1,
      temperatureK: 300,
    }).saturationCurrentPicoA;
    expect(higherV).toBeLessThan(base);

    // higher T -> larger Is (since Vt larger, exponent smaller)
    const hotter = calculateDiodeSaturationCurrent({
      forwardCurrentMa: 1,
      forwardVoltageV: 0.65,
      idealityFactor: 1,
      temperatureK: 350,
    }).saturationCurrentPicoA;
    expect(hotter).toBeGreaterThan(base);

    // inverse: I = Is·(exp(V/(nVt)) - 1)
    const vt = (1.380649e-23 * 300) / 1.602176634e-19;
    const recoveredI = base * 1e-12 * Math.expm1(0.65 / vt);
    expect(recoveredI * 1e3).toBeCloseTo(1, 10);
  });

  it("handles extremes without -0 and preserves full precision", () => {
    expect(() =>
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: Number.MIN_VALUE,
        forwardVoltageV: 0.65,
      }),
    ).toThrow();

    expect(() =>
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 50,
        idealityFactor: 1,
        temperatureK: 300,
      }),
    ).toThrow();

    const direct = calculateDiodeSaturationCurrent(
      diodeSaturationCurrentExample.input,
    ).saturationCurrentPicoA;
    expect(direct).toBe(
      diodeSaturationCurrentExample.output.saturationCurrentPicoA,
    );
    expect(direct.toString()).not.toBe("0.0120359561947");
  });

  it("reports numeric overflow for extreme exponential", () => {
    let err: unknown = null;
    try {
      calculateDiodeSaturationCurrent({
        forwardCurrentMa: 1,
        forwardVoltageV: 1e6,
        idealityFactor: 1,
        temperatureK: 300,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { code: string }).code).toBe("numeric_underflow");
  });
});
