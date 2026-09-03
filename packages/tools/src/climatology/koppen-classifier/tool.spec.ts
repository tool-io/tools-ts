import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import { calculate as subclass } from "../koppen-subclass-resolver/tool.js";
import {
  calculate as trewartha,
  example as trewarthaExample,
} from "../trewartha-classifier/tool.js";
import {
  calculate as holdridge,
  example as holdridgeExample,
} from "../holdridge-life-zone/tool.js";
import { calculate as spi, example as spiExample } from "../spi-index/tool.js";
import {
  calculate as spei,
  example as speiExample,
} from "../spei-index/tool.js";
import {
  calculate as palmer,
  example as palmerExample,
} from "../pdsi-simplified/tool.js";
import {
  calculate as trend,
  example as trendExample,
} from "../trend-slope-per-decade/tool.js";
import {
  calculate as feedback,
  example as feedbackExample,
} from "../climate-sensitivity-feedback/tool.js";
import {
  calculate as turc,
  example as turcExample,
} from "../turc-irrigation-need/tool.js";
import {
  calculate as runoff,
  example as runoffExample,
} from "../runoff-coefficient-regional/tool.js";
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
  it("uses ET at exactly zero hottest-month temperature", () => {
    expect(
      calculate({ ...example.input, monthlyTemperatureC: Array(12).fill(0) })
        .koppenCode,
    ).toBe("ET");
  });
  it("uses EF below zero hottest-month temperature", () => {
    expect(
      calculate({ ...example.input, monthlyTemperatureC: Array(12).fill(-1) })
        .koppenCode,
    ).toBe("EF");
  });
  it("tests aridity before tropical seasonal classification", () => {
    expect(
      calculate({ ...example.input, monthlyPrecipitationMm: Array(12).fill(0) })
        .koppenCode,
    ).toBe("BWh");
  });
  it("uses the declared zero-degree C versus D boundary", () => {
    const t = [0, 5, 10, 15, 18, 20, 20, 20, 15, 10, 5, 2];
    expect(
      calculate({ ...example.input, monthlyTemperatureC: t }).koppenCode,
    ).toBe("Dfb");
    expect(
      calculate({ ...example.input, monthlyTemperatureC: [1, ...t.slice(1)] })
        .koppenCode,
    ).toBe("Cfb");
  });
  it("keeps the named thermal subclass syntax distinct from precipitation subclasses", () => {
    expect(subclass({ observedKoppenCode: "BWh" })).toEqual({
      mainClimateGroup: "B",
      precipitationSubclass: "W",
      thermalSubclass: "h",
    });
    expect(() => subclass({ observedKoppenCode: "Cfd" })).toThrow();
  });
  it("does not force Trewartha aridity or tropical identity from the warmest month alone", () => {
    expect(
      trewartha({
        ...trewarthaExample.input,
        monthlyTemperatureC: [0, 0, 0, 10, 10, 10, 10, 10, 0, 0, 0, 0],
      }).trewarthaThermalGroup,
    ).toBe("D");
  });
  it("requires twelve complete climatological months", () => {
    expect(() =>
      calculate({ ...example.input, monthlyTemperatureC: Array(11).fill(25) }),
    ).toThrow();
  });
  it("queries independently supplied Holdridge polygons with compatible zones retained", () => {
    const r = holdridge(holdridgeExample.input);
    expect(r.compatibleCallerZoneIds).toEqual(["zone-a"]);
    expect(r.holdridgePotentialEvaporationRatio).toBeCloseTo(1.1786);
  });
  it("does not extrapolate a climatological precipitation CDF", () => {
    expect(() =>
      spi({ ...spiExample.input, observedMatchedPrecipitation: 3 }),
    ).toThrow();
  });
  it("refuses fabricated infinite standardized CDF tails", () => {
    expect(() =>
      spi({
        ...spiExample.input,
        independentlyCalibratedPrecipitationCdf: [0, 0.5, 1],
        observedMatchedPrecipitation: 0,
      }),
    ).toThrow();
  });
  it("keeps signed water-balance coordinates for SPEI", () => {
    expect(
      spei({ ...speiExample.input, observedMatchedWaterBalance: -1 })
        .conditionalStandardNormalIndex,
    ).toBeCloseTo(-1.2815515655, 8);
  });
  it("rejects a decreasing purported CDF even if the query is inside it", () => {
    expect(() =>
      spei({
        ...speiExample.input,
        independentlyCalibratedWaterBalanceCdf: [0.9, 0.5, 0.1],
      }),
    ).toThrow();
  });
  it("preserves a separately calibrated Palmer Z state instead of substituting rain-minus-PET", () => {
    expect(
      palmer({
        ...palmerExample.input,
        callerPreviousPalmerState: 2,
        independentlyCalibratedMonthlyPalmerZ: [0],
      }).simplifiedMonthlyPalmerStates,
    ).toEqual([1.794]);
  });
  it("uses actual irregular years for OLS trend", () => {
    expect(
      trend({
        ...trendExample.input,
        observedYears: [2000, 2005, 2020],
        observedTemperatureAnomaliesC: [0, 0.5, 2],
      }).ordinaryLeastSquaresTrendCPerDecade,
    ).toBeCloseTo(1);
  });
  it("requires a positive net restoring feedback instead of returning unstable equilibrium sensitivity", () => {
    expect(() =>
      feedback({
        ...feedbackExample.input,
        callerSignedAmplifyingFeedbackComponentsWPerM2K: [3],
      }),
    ).toThrow();
  });
  it("retains signed stabilizing feedback components", () => {
    expect(
      feedback({
        ...feedbackExample.input,
        callerSignedAmplifyingFeedbackComponentsWPerM2K: [-1],
      }).netRestoringFeedbackWPerM2K,
    ).toBe(4);
  });
  it("applies the low-relative-humidity Turc correction in its declared branch", () => {
    const dry = turc({
        ...turcExample.input,
        observedMeanRelativeHumidityPercent: 15,
      }),
      wet = turc(turcExample.input);
    expect(dry.turcReferenceEtMm / wet.turcReferenceEtMm).toBeCloseTo(1.5);
  });
  it("preserves observed runoff coefficients above one rather than clamping hydrologic evidence", () => {
    expect(
      runoff({
        ...runoffExample.input,
        observedMatchedRunoffVolumesM3: [20, 40],
      }).pooledObservedRunoffCoefficient,
    ).toBe(2);
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
    const input = {
      ...example.input,
      monthlyTemperatureC: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      monthlyPrecipitationMm: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    };
    close(calculate(input), {
      koppenCode: "BWh",
      annualTemperatureC: 25,
      annualPrecipitationMm: 120,
      dryClimateThresholdMm: 640,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        koppenCode: "BWh",
        annualTemperatureC: 25,
        annualPrecipitationMm: 120,
        dryClimateThresholdMm: 640,
      });
  });
});
