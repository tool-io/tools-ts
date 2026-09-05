import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as tas,
  example as tasExample,
} from "../tas-classification/tool.js";
import { calculate as chi } from "../fission-track-chi-square-test/tool.js";
import {
  calculate as plateau,
  example as plateauExample,
} from "../argon-argon-plateau-age/tool.js";
import {
  calculate as burial,
  example as burialExample,
} from "../aluminum-26-beryllium-10-burial-age/tool.js";
import {
  calculate as folding,
  example as foldExample,
} from "../paleomagnetic-fold-test/tool.js";
import {
  calculate as janbu,
  example as janbuExample,
} from "../geomechanics-landslide-factor-of-safety-janbu/tool.js";
import {
  calculate as melting,
  example as meltExample,
} from "../fractional-melting/tool.js";
import {
  calculate as carbon,
  example as carbonExample,
} from "../radiocarbon-calibration/tool.js";
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
  it("refuses unresolved opposed current observations", () => {
    expect(() =>
      calculate({ azimuthDegrees: [0, 180], observationWeights: [1, 1] }),
    ).toThrow();
  });
  it("rejects unnormalized current azimuths rather than silently wrapping", () => {
    expect(() =>
      calculate({ azimuthDegrees: [360], observationWeights: [1] }),
    ).toThrow();
  });
  it("does not silently assign shared TAS boundaries to one class", () => {
    expect(
      tas({ ...tasExample.input, observedTasX: 1, observedTasY: 1 })
        .matchingClasses,
    ).toEqual(["a", "b"]);
  });
  it("rejects fractional polygon class indices", () => {
    expect(() =>
      tas({
        ...tasExample.input,
        callerTasVertices: [
          [0.5, 0, 0],
          [0.5, 1, 0],
          [0.5, 0, 1],
        ],
      }),
    ).toThrow();
  });
  it("rejects collapsed and crossing polygons", () => {
    for (const p of [
      [
        [0, 0, 0],
        [0, 1, 1],
        [0, 2, 2],
      ],
      [
        [0, 0, 0],
        [0, 1, 1],
        [0, 0, 1],
        [0, 1, 0],
      ],
    ])
      expect(() =>
        tas({
          ...tasExample.input,
          callerTasClassIds: ["a"],
          callerTasVertices: p,
        }),
      ).toThrow();
  });
  it("accepts an explicit closing vertex without inventing extra area", () => {
    expect(
      tas({
        ...tasExample.input,
        callerTasClassIds: ["a"],
        callerTasVertices: [
          [0, 0, 0],
          [0, 1, 0],
          [0, 1, 1],
          [0, 0, 1],
          [0, 0, 0],
        ],
      }).matchingClasses,
    ).toEqual(["a"]);
  });
  it("uses grain contingency evidence rather than a pooled age statistic", () => {
    expect(chi({ spontaneousCounts: [10, 0], inducedCounts: [0, 10] })).toEqual(
      { pearsonStatistic: 20, degreesOfFreedom: 1 },
    );
    expect(() =>
      chi({ spontaneousCounts: [0, 0], inducedCounts: [1, 2] }),
    ).toThrow();
  });
  it("keeps the earliest exactly tied plateau window", () => {
    expect(
      plateau({
        ...plateauExample.input,
        stepAges: [1, 1, 1, 9, 2, 2, 2],
        releasedArgonWeights: [1, 1, 1, 1, 1, 1, 1],
        callerMinimumReleasedFraction: 0.4,
      }).observedPlateauStartIndex,
    ).toBe(0);
  });
  it("does not count disjoint age matches as a contiguous plateau", () => {
    expect(
      plateau({
        ...plateauExample.input,
        stepAges: [1, 9, 1, 9],
        callerMinimumReleasedFraction: 0.1,
      }).noQualifyingPlateau,
    ).toBe(true);
  });
  it("refuses a postburial-production/inverted ratio on the simple burial branch", () => {
    expect(() =>
      burial({ ...burialExample.input, measuredAlBeRatio: 9 }),
    ).toThrow();
  });
  it("rejects nonunit independently rotated fold vectors", () => {
    expect(() =>
      folding({
        ...foldExample.input,
        independentlyCorrectedDirectionVectors:
          foldExample.input.independentlyCorrectedDirectionVectors.map(() => [
            2, 0, 0,
          ]),
      }),
    ).toThrow();
  });
  it("refuses Janbu tensile effective slice loads", () => {
    expect(() =>
      janbu({ ...janbuExample.input, porePressures: [2] }),
    ).toThrow();
  });
  it("supports mixed signed Janbu slice slopes on the positive-denominator branch", () => {
    const r = janbu({
      sliceWidths: [1, 1],
      sliceWeights: [2, 1],
      porePressures: [0, 0],
      cohesions: [1, 1],
      frictionRadians: [0.2, 0.2],
      baseRadians: [0.5, -0.2],
      independentJanbuCorrection: 1,
    });
    expect(r.janbuSimplifiedFactor).toBeGreaterThan(0);
    expect(Math.abs(r.equilibriumResidual)).toBeLessThan(1e-10);
  });
  it("refuses total fractional extraction at the singular instantaneous endpoint", () => {
    expect(() =>
      melting({ ...meltExample.input, extractedFractions: [1] }),
    ).toThrow();
  });
  it("retains calibration plateau sample witnesses without forcing one age", () => {
    expect(
      carbon({
        ...carbonExample.input,
        callerRadiocarbonCurveYears: [1, 1, 1, 1],
      }).matchingCalendarAgesYears,
    ).toEqual([0, 1, 2, 3]);
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
    const input = { ...example.input, observationWeights: [0, 0] };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, azimuthDegrees: [90, 90] };
    close(calculate(input), {
      circularMeanDegrees: 90,
      resultantConcentration: 1,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        circularMeanDegrees: 90,
        resultantConcentration: 1,
      });
  });
});
