import { describe, expect, it } from "vitest";
import {
  calculateEffectiveDensityConductionBand,
  effectiveDensityConductionBandExample,
  runEffectiveDensityConductionBand,
} from "./tool.js";
import type { EffectiveDensityConductionBandOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runEffectiveDensityConductionBand>,
): EffectiveDensityConductionBandOutput => {
  if (!result.ok) throw new Error("Expected success");
  return result.output as EffectiveDensityConductionBandOutput;
};

describe("semiconductor effective density conduction band", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEffectiveDensityConductionBand(
        effectiveDensityConductionBandExample.input,
      ),
    ).toEqual({
      ok: true,
      output: effectiveDensityConductionBandExample.output,
    });
    expect(
      calculateEffectiveDensityConductionBand(
        effectiveDensityConductionBandExample.input,
      ).ncPerCm3,
    ).toBe(28171459974946275000);
  });

  it("defaults to a unit mass at 300 K", () => {
    expect(calculateEffectiveDensityConductionBand({})).toEqual({
      ncPerCm3: 2.51e19,
    });
    expect(runEffectiveDensityConductionBand({})).toEqual({
      ok: true,
      output: { ncPerCm3: 2.51e19 },
    });
  });

  it("scales with the three-halves power of mass and temperature", () => {
    const doubledMass = calculateEffectiveDensityConductionBand({
      massRatioX: 2,
      temperatureK: 300,
    }).ncPerCm3;
    expect(doubledMass / 2.51e19).toBeCloseTo(2 ** 1.5, 12);
    const doubledTemp = calculateEffectiveDensityConductionBand({
      massRatioX: 1,
      temperatureK: 600,
    }).ncPerCm3;
    expect(doubledTemp / 2.51e19).toBeCloseTo(2 ** 1.5, 12);
    // combined
    const bothDoubled = calculateEffectiveDensityConductionBand({
      massRatioX: 2,
      temperatureK: 600,
    }).ncPerCm3;
    expect(bothDoubled / 2.51e19).toBeCloseTo((2 * 2) ** 1.5, 12);
  });

  it("uses defaults when inputs are omitted individually", () => {
    const onlyMass = outputOf(
      runEffectiveDensityConductionBand({ massRatioX: 1.5 }),
    ).ncPerCm3;
    const explicitMass = calculateEffectiveDensityConductionBand({
      massRatioX: 1.5,
      temperatureK: 300,
    }).ncPerCm3;
    expect(onlyMass).toBe(explicitMass);
    const onlyTemp = outputOf(
      runEffectiveDensityConductionBand({ temperatureK: 350 }),
    ).ncPerCm3;
    const explicitTemp = calculateEffectiveDensityConductionBand({
      massRatioX: 1,
      temperatureK: 350,
    }).ncPerCm3;
    expect(onlyTemp).toBe(explicitTemp);
  });

  it("rejects missing, wrong, unknown, non-object inputs", () => {
    // empty is valid due to defaults, but test wrong type and unknown
    expect(
      runEffectiveDensityConductionBand({ massRatioX: "1" as never }).ok,
    ).toBe(false);
    expect(
      runEffectiveDensityConductionBand({ temperatureK: "300" as never }).ok,
    ).toBe(false);
    const unk = runEffectiveDensityConductionBand({
      massRatioX: 1,
      temperatureK: 300,
      extra: 1,
    } as never);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
    expect(runEffectiveDensityConductionBand(null as never).ok).toBe(false);
    if (!runEffectiveDensityConductionBand(null as never).ok)
      expect(
        runEffectiveDensityConductionBand(null as never).error.issues[0].code,
      ).toBe("object_required");
    expect(runEffectiveDensityConductionBand([] as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runEffectiveDensityConductionBand({
          massRatioX: bad,
          temperatureK: 300,
        }).ok,
      ).toBe(false);
      expect(
        runEffectiveDensityConductionBand({ massRatioX: 1, temperatureK: bad })
          .ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateEffectiveDensityConductionBand>[0];
      field: string;
    }> = [
      {
        input: { massRatioX: Number.NaN, temperatureK: 300 },
        field: "massRatioX",
      },
      {
        input: { massRatioX: Number.POSITIVE_INFINITY, temperatureK: 300 },
        field: "massRatioX",
      },
      {
        input: { massRatioX: 1, temperatureK: Number.NaN },
        field: "temperatureK",
      },
      {
        input: { massRatioX: 1, temperatureK: Number.POSITIVE_INFINITY },
        field: "temperatureK",
      },
    ];
    for (const { input, field } of cases) {
      let err: unknown = null;
      try {
        calculateEffectiveDensityConductionBand(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: non-positive mass and temperature", () => {
    expect(
      runEffectiveDensityConductionBand({ massRatioX: 0, temperatureK: 300 })
        .ok,
    ).toBe(false);
    expect(
      runEffectiveDensityConductionBand({ massRatioX: -1, temperatureK: 300 })
        .ok,
    ).toBe(false);
    expect(
      runEffectiveDensityConductionBand({ massRatioX: 1, temperatureK: 0 }).ok,
    ).toBe(false);
    expect(
      runEffectiveDensityConductionBand({ massRatioX: 1, temperatureK: -10 })
        .ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateEffectiveDensityConductionBand({
        massRatioX: 0,
        temperatureK: 300,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("massRatioX");
    expect((err as { code: string }).code).toBe("invalid_mass");
    err = null;
    try {
      calculateEffectiveDensityConductionBand({
        massRatioX: 1,
        temperatureK: 0,
      });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("temperatureK");
    expect((err as { code: string }).code).toBe("invalid_temperature");
  });

  it("direct calculator mirrors runner for valid and invalid", () => {
    expect(
      calculateEffectiveDensityConductionBand(
        effectiveDensityConductionBandExample.input,
      ).ncPerCm3,
    ).toBe(28171459974946275000);
    expect(() =>
      calculateEffectiveDensityConductionBand({
        massRatioX: 0,
        temperatureK: 300,
      }),
    ).toThrow();
    expect(() =>
      calculateEffectiveDensityConductionBand({
        massRatioX: Number.NaN,
        temperatureK: 300,
      }),
    ).toThrow();
    const viaRunner = outputOf(
      runEffectiveDensityConductionBand(
        effectiveDensityConductionBandExample.input,
      ),
    ).ncPerCm3;
    const direct = calculateEffectiveDensityConductionBand(
      effectiveDensityConductionBandExample.input,
    ).ncPerCm3;
    expect(viaRunner).toBe(direct);
  });

  it("preserves properties: monotonic, inverse, and ratio", () => {
    const base = calculateEffectiveDensityConductionBand({
      massRatioX: 1,
      temperatureK: 300,
    }).ncPerCm3;
    const largerMass = calculateEffectiveDensityConductionBand({
      massRatioX: 4,
      temperatureK: 300,
    }).ncPerCm3;
    expect(largerMass).toBeGreaterThan(base);
    expect(largerMass / base).toBeCloseTo(8, 12);

    const hotter = calculateEffectiveDensityConductionBand({
      massRatioX: 1,
      temperatureK: 1200,
    }).ncPerCm3;
    expect(hotter).toBeGreaterThan(base);
    expect(hotter / base).toBeCloseTo(8, 12);

    // inverse: mass = (Nc/(2.51e19*(T/300)^{1.5}))^{2/3}
    const example = calculateEffectiveDensityConductionBand({
      massRatioX: 1.08,
      temperatureK: 300,
    }).ncPerCm3;
    const recovered = (example / 2.51e19) ** (2 / 3);
    expect(recovered).toBeCloseTo(1.08, 10);

    // monotonic overall
    const low = calculateEffectiveDensityConductionBand({
      massRatioX: 0.5,
      temperatureK: 200,
    }).ncPerCm3;
    const high = calculateEffectiveDensityConductionBand({
      massRatioX: 2,
      temperatureK: 600,
    }).ncPerCm3;
    expect(high).toBeGreaterThan(low);
  });

  it("handles extremes without -0 and preserves full precision", () => {
    const huge = calculateEffectiveDensityConductionBand({
      massRatioX: 1e6,
      temperatureK: 1e4,
    });
    expect(Number.isFinite(huge.ncPerCm3)).toBe(true);
    expect(Object.is(huge.ncPerCm3, -0)).toBe(false);

    // very small but still finite regime (avoid subnormal underflow to 0)
    const tiny = calculateEffectiveDensityConductionBand({
      massRatioX: 1e-6,
      temperatureK: 1e-2,
    });
    expect(Number.isFinite(tiny.ncPerCm3)).toBe(true);
    expect(tiny.ncPerCm3).toBeGreaterThan(0);
    expect(Object.is(tiny.ncPerCm3, -0)).toBe(false);
    // underflow case should throw numeric_overflow
    let err: unknown = null;
    try {
      calculateEffectiveDensityConductionBand({
        massRatioX: Number.MIN_VALUE,
        temperatureK: Number.MIN_VALUE,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    expect((err as { code: string }).code).toBe("numeric_overflow");

    const direct = calculateEffectiveDensityConductionBand(
      effectiveDensityConductionBandExample.input,
    ).ncPerCm3;
    expect(direct).toBe(28171459974946275000);
    expect(Object.is(direct, -0)).toBe(false);
  });

  it("reports numeric overflow for huge inputs", () => {
    let err: unknown = null;
    try {
      calculateEffectiveDensityConductionBand({
        massRatioX: Number.MAX_VALUE,
        temperatureK: Number.MAX_VALUE,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    expect((err as { code: string }).code).toBe("numeric_overflow");
    expect((err as { field: string }).field).toBeDefined();
  });
});
