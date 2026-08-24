import { describe, expect, it } from "vitest";
import {
  calculateEffectiveDensityValenceBand,
  effectiveDensityValenceBandExample,
  runEffectiveDensityValenceBand,
} from "./tool.js";
import type { EffectiveDensityValenceBandOutput } from "./tool.js";

const outputOf = (
  result: ReturnType<typeof runEffectiveDensityValenceBand>,
): EffectiveDensityValenceBandOutput => {
  if (!result.ok) throw new Error("Expected success");
  return result.output as EffectiveDensityValenceBandOutput;
};

describe("semiconductor effective density valence band", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runEffectiveDensityValenceBand(effectiveDensityValenceBandExample.input),
    ).toEqual({ ok: true, output: effectiveDensityValenceBandExample.output });
    expect(
      calculateEffectiveDensityValenceBand(
        effectiveDensityValenceBandExample.input,
      ).nvPerCm3,
    ).toBe(effectiveDensityValenceBandExample.output.nvPerCm3);
  });

  it("defaults to a unit mass at 300 K", () => {
    expect(calculateEffectiveDensityValenceBand({})).toEqual({
      nvPerCm3: 2.51e19,
    });
    expect(runEffectiveDensityValenceBand({})).toEqual({
      ok: true,
      output: { nvPerCm3: 2.51e19 },
    });
  });

  it("scales with the three-halves power of mass and temperature", () => {
    const doubledMass = calculateEffectiveDensityValenceBand({
      massRatioX: 2,
      temperatureK: 300,
    }).nvPerCm3;
    expect(doubledMass / 2.51e19).toBeCloseTo(2 ** 1.5, 12);
    const doubledTemp = calculateEffectiveDensityValenceBand({
      massRatioX: 1,
      temperatureK: 600,
    }).nvPerCm3;
    expect(doubledTemp / 2.51e19).toBeCloseTo(2 ** 1.5, 12);
    const both = calculateEffectiveDensityValenceBand({
      massRatioX: 2,
      temperatureK: 600,
    }).nvPerCm3;
    expect(both / 2.51e19).toBeCloseTo((2 * 2) ** 1.5, 12);
  });

  it("uses defaults when omitted individually", () => {
    const onlyMass = outputOf(
      runEffectiveDensityValenceBand({ massRatioX: 1.5 }),
    ).nvPerCm3;
    const explicit = calculateEffectiveDensityValenceBand({
      massRatioX: 1.5,
      temperatureK: 300,
    }).nvPerCm3;
    expect(onlyMass).toBe(explicit);
    const onlyTemp = outputOf(
      runEffectiveDensityValenceBand({ temperatureK: 350 }),
    ).nvPerCm3;
    const explicitTemp = calculateEffectiveDensityValenceBand({
      massRatioX: 1,
      temperatureK: 350,
    }).nvPerCm3;
    expect(onlyTemp).toBe(explicitTemp);
  });

  it("rejects wrong, unknown, non-object", () => {
    expect(
      runEffectiveDensityValenceBand({ massRatioX: "1" as never }).ok,
    ).toBe(false);
    expect(
      runEffectiveDensityValenceBand({ temperatureK: "300" as never }).ok,
    ).toBe(false);
    const unk = runEffectiveDensityValenceBand({
      massRatioX: 1,
      temperatureK: 300,
      extra: 1,
    } as never);
    expect(unk.ok).toBe(false);
    if (!unk.ok) expect(unk.error.issues[0].code).toBe("unknown_field");
    expect(runEffectiveDensityValenceBand(null as never).ok).toBe(false);
    if (!runEffectiveDensityValenceBand(null as never).ok)
      expect(
        runEffectiveDensityValenceBand(null as never).error.issues[0].code,
      ).toBe("object_required");
    expect(runEffectiveDensityValenceBand([] as never).ok).toBe(false);
  });

  it("rejects non-finite inputs via runner and direct", () => {
    for (const bad of [
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ]) {
      expect(
        runEffectiveDensityValenceBand({ massRatioX: bad, temperatureK: 300 })
          .ok,
      ).toBe(false);
      expect(
        runEffectiveDensityValenceBand({ massRatioX: 1, temperatureK: bad }).ok,
      ).toBe(false);
    }
    const cases: Array<{
      input: Parameters<typeof calculateEffectiveDensityValenceBand>[0];
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
        calculateEffectiveDensityValenceBand(input);
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeNull();
      expect((err as { field: string }).field).toBe(field);
    }
  });

  it("rejects boundaries: non-positive mass and temperature", () => {
    expect(
      runEffectiveDensityValenceBand({ massRatioX: 0, temperatureK: 300 }).ok,
    ).toBe(false);
    expect(
      runEffectiveDensityValenceBand({ massRatioX: -1, temperatureK: 300 }).ok,
    ).toBe(false);
    expect(
      runEffectiveDensityValenceBand({ massRatioX: 1, temperatureK: 0 }).ok,
    ).toBe(false);
    expect(
      runEffectiveDensityValenceBand({ massRatioX: 1, temperatureK: -10 }).ok,
    ).toBe(false);
    let err: unknown = null;
    try {
      calculateEffectiveDensityValenceBand({
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
      calculateEffectiveDensityValenceBand({ massRatioX: 1, temperatureK: 0 });
    } catch (e) {
      err = e;
    }
    expect((err as { field: string }).field).toBe("temperatureK");
  });

  it("direct calculator mirrors runner", () => {
    expect(
      calculateEffectiveDensityValenceBand(
        effectiveDensityValenceBandExample.input,
      ).nvPerCm3,
    ).toBe(effectiveDensityValenceBandExample.output.nvPerCm3);
    expect(() =>
      calculateEffectiveDensityValenceBand({
        massRatioX: 0,
        temperatureK: 300,
      }),
    ).toThrow();
    expect(() =>
      calculateEffectiveDensityValenceBand({
        massRatioX: Number.NaN,
        temperatureK: 300,
      }),
    ).toThrow();
    const viaRunner = outputOf(
      runEffectiveDensityValenceBand(effectiveDensityValenceBandExample.input),
    ).nvPerCm3;
    const direct = calculateEffectiveDensityValenceBand(
      effectiveDensityValenceBandExample.input,
    ).nvPerCm3;
    expect(viaRunner).toBe(direct);
  });

  it("preserves properties: monotonic, inverse, ratio", () => {
    const base = calculateEffectiveDensityValenceBand({
      massRatioX: 1,
      temperatureK: 300,
    }).nvPerCm3;
    const largerMass = calculateEffectiveDensityValenceBand({
      massRatioX: 4,
      temperatureK: 300,
    }).nvPerCm3;
    expect(largerMass).toBeGreaterThan(base);
    expect(largerMass / base).toBeCloseTo(8, 12);
    const hotter = calculateEffectiveDensityValenceBand({
      massRatioX: 1,
      temperatureK: 1200,
    }).nvPerCm3;
    expect(hotter).toBeGreaterThan(base);
    expect(hotter / base).toBeCloseTo(8, 12);
    const recovered =
      (effectiveDensityValenceBandExample.output.nvPerCm3 / 2.51e19) ** (2 / 3);
    expect(recovered).toBeCloseTo(0.56, 10);
    const low = calculateEffectiveDensityValenceBand({
      massRatioX: 0.5,
      temperatureK: 200,
    }).nvPerCm3;
    const high = calculateEffectiveDensityValenceBand({
      massRatioX: 2,
      temperatureK: 600,
    }).nvPerCm3;
    expect(high).toBeGreaterThan(low);
  });

  it("handles extremes without -0 and preserves full precision", () => {
    const huge = calculateEffectiveDensityValenceBand({
      massRatioX: 1e6,
      temperatureK: 1e4,
    });
    expect(Number.isFinite(huge.nvPerCm3)).toBe(true);
    expect(Object.is(huge.nvPerCm3, -0)).toBe(false);
    const tiny = calculateEffectiveDensityValenceBand({
      massRatioX: 1e-6,
      temperatureK: 1e-2,
    });
    expect(Number.isFinite(tiny.nvPerCm3)).toBe(true);
    expect(tiny.nvPerCm3).toBeGreaterThan(0);
    expect(Object.is(tiny.nvPerCm3, -0)).toBe(false);
    let err: unknown = null;
    try {
      calculateEffectiveDensityValenceBand({
        massRatioX: Number.MIN_VALUE,
        temperatureK: Number.MIN_VALUE,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    expect((err as { code: string }).code).toBe("numeric_overflow");
    const direct = calculateEffectiveDensityValenceBand(
      effectiveDensityValenceBandExample.input,
    ).nvPerCm3;
    expect(direct).toBe(effectiveDensityValenceBandExample.output.nvPerCm3);
    expect(Object.is(direct, -0)).toBe(false);
  });

  it("reports numeric overflow for huge inputs", () => {
    let err: unknown = null;
    try {
      calculateEffectiveDensityValenceBand({
        massRatioX: Number.MAX_VALUE,
        temperatureK: Number.MAX_VALUE,
      });
    } catch (e) {
      err = e;
    }
    expect(err).not.toBeNull();
    expect((err as { code: string }).code).toBe("numeric_overflow");
  });
});
