import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as lookback,
  example as lookbackExample,
} from "../lookback-time-approx-z/tool.js";
import {
  calculate as luminosityDistance,
  example as luminosityExample,
} from "../luminosity-distance-from-z-approx/tool.js";
import {
  calculate as combined,
  example as combinedExample,
} from "../combined-magnitude-binary-star/tool.js";
import {
  calculate as redshift,
  example as redshiftExample,
} from "../redshift-recession-velocity/tool.js";
import {
  calculate as transit,
  example as transitExample,
} from "../exoplanet-period-from-transit-spacing/tool.js";
import {
  calculate as neutron,
  example as neutronExample,
} from "../neutron-star-density-tonnes-per-cubic-cm/tool.js";
import {
  calculate as npf,
  example as npfExample,
} from "../npf-rule-approximate-shutter-pixels/tool.js";
import {
  calculate as phase,
  example as phaseExample,
} from "../moon-age-days-from-elongation/tool.js";
import {
  calculate as illumination,
  example as illuminationExample,
} from "../lunar-phase-illumination-percent/tool.js";
import {
  calculate as moonrise,
  example as moonriseExample,
} from "../moon-rise-delay-per-day-minutes/tool.js";
import {
  calculate as hz,
  example as hzExample,
} from "../exoplanet-habitable-zone-inner-edge/tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("agrees with the independently analytic Einstein-de Sitter distance integral", () => {
    const r = calculate({
      ...example.input,
      matterDensityFraction: 1,
      redshift: 3,
    });
    expect(r.flatModelComovingMpc).toBeCloseTo(299792.458 / 70, 6);
  });
  it("agrees with the independently analytic Einstein-de Sitter lookback integral", () => {
    const r = lookback({
        ...lookbackExample.input,
        matterDensityFraction: 1,
        redshift: 3,
      }),
      hubbleGyr = 3.0856775814913673e19 / 70 / (365.25 * 86400 * 1e9);
    expect(r.flatModelLookbackGyr).toBeCloseTo((hubbleGyr * 7) / 12, 6);
  });
  it("retains the luminosity-distance redshift factor", () => {
    const input = { ...example.input, matterDensityFraction: 1, redshift: 3 };
    expect(
      luminosityDistance({ ...luminosityExample.input, ...input })
        .flatModelLuminosityDistanceMpc,
    ).toBeCloseTo(4 * calculate(input).flatModelComovingMpc, 6);
  });
  it("refuses an unsupported radiation-era integration beyond the declared bound", () => {
    expect(() => calculate({ ...example.input, redshift: 21 })).toThrow();
  });
  it("combines very different stellar magnitudes without flux overflow", () => {
    expect(
      combined({
        ...combinedExample.input,
        firstMagnitude: -1000,
        secondMagnitude: 1000,
      }).combinedMagnitude,
    ).toBe(-1000);
  });
  it("is symmetric in binary-star input order", () => {
    expect(
      combined({
        ...combinedExample.input,
        firstMagnitude: 2,
        secondMagnitude: 3,
      }),
    ).toEqual(
      combined({
        ...combinedExample.input,
        firstMagnitude: 3,
        secondMagnitude: 2,
      }),
    );
  });
  it("preserves radial blueshift rather than forcing recession", () => {
    const r = redshift({
      ...redshiftExample.input,
      specialRelativisticRadialRedshift: -0.5,
    });
    expect(r.radialBeta).toBeCloseTo(-0.6);
  });
  it("accounts for skipped transit cycles instead of averaging raw spacing", () => {
    expect(
      transit(transitExample.input).leastSquaresOrbitalPeriodDays,
    ).toBeCloseTo(10);
  });
  it("refuses fractional transit cycle ordinals", () => {
    expect(() =>
      transit({
        ...transitExample.input,
        callerIntegerCycleOrdinals: [0, 1.5, 3],
      }),
    ).toThrow();
  });
  it("uses the correct tonne per cubic centimetre density conversion", () => {
    const r = neutron({
      ...neutronExample.input,
      massKg: ((4 * Math.PI) / 3) * 1e18,
    });
    expect(r.meanDensityTonnesPerCubicCm).toBeCloseTo(1);
  });
  it("computes the named simplified NPF numerator without a fictitious offset", () => {
    expect(npf(npfExample.input).approximateNpfSeconds).toBe(3.8);
  });
  it("does not extrapolate the NPF model to a polar singularity", () => {
    expect(() =>
      npf({ ...npfExample.input, declinationDegrees: 81 }),
    ).toThrow();
  });
  it("distinguishes oriented lunar age from unoriented illumination", () => {
    expect(
      phase({ ...phaseExample.input, orientedSynodicElongationDegrees: 270 })
        .uniformPhaseAgeDays,
    ).toBeCloseTo(phaseExample.input.callerSynodicPeriodDays * 0.75);
    expect(
      illumination({
        ...illuminationExample.input,
        observedSunMoonElongationDegrees: 90,
      }).distantSunLunarIlluminationPercent,
    ).toBeCloseTo(50);
  });
  it("retains negative observed daily moonrise delays", () => {
    const r = moonrise({
      ...moonriseExample.input,
      observedMoonriseUtcTimes: [
        "2026-01-01T01:00:00Z",
        "2026-01-02T00:30:00Z",
      ],
    });
    expect(r.observedDailyRiseDelayMinutes).toEqual([-30]);
  });
  it("requires consistent inner and outer habitable-zone flux evidence", () => {
    expect(() =>
      hz({
        ...hzExample.input,
        callerInnerEffectiveFluxSolar: 0.2,
        callerOuterEffectiveFluxSolar: 0.25,
      }),
    ).toThrow();
  });
  it("computes independent canonical values", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown fields", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects wrong types and nonfinite evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("is deterministic and preserves evidence", () => {
    const input = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(input);
    close(calculate(input), example.output);
    close(calculate(input), example.output);
    expect(JSON.stringify(input)).toBe(before);
  });
  it("bounds evidence and refuses inherited sparse slots", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (Array.isArray(v)) {
        const invalid =
          typeof v[0] === "string"
            ? Array(129).fill("x")
            : Array.isArray(v[0])
              ? Array.from({ length: 129 }, () => [0, 0])
              : Array(10001).fill(0);
        expect(tool.execute({ ...example.input, [k]: invalid })).toMatchObject({
          ok: false,
        });
        const sparse = Array(1);
        Object.setPrototypeOf(
          sparse,
          Object.assign(Object.create(Array.prototype), { 0: v[0] }),
        );
        expect(() => calculate({ ...example.input, [k]: sparse })).toThrow();
      }
    }
  });
  it("rejects invalid domains", () => {
    const input = { ...example.input, redshift: 21 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, redshift: 0 };
    close(calculate(input), { flatModelComovingMpc: 0 });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, { flatModelComovingMpc: 0 });
  });
});
