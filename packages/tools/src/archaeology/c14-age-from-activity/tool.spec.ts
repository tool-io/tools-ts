import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as intcal,
  example as intcalExample,
} from "../radiocarbon-calibration-intcal-curve/tool.js";
import {
  calculate as argon,
  example as argonExample,
} from "../potassium-argon-age/tool.js";
import {
  calculate as uranium,
  example as uraniumExample,
} from "../uranium-series-age-speleothem/tool.js";
import {
  calculate as magnetic,
  example as magneticExample,
} from "../archaeomagnetic-date-lookup/tool.js";
import {
  calculate as hull,
  example as hullExample,
} from "../site-size-from-artifact-scatter/tool.js";
import {
  calculate as neighbor,
  example as neighborExample,
} from "../settlement-spacing-nearest-neighbor/tool.js";
import {
  calculate as dipole,
  example as dipoleExample,
} from "../magnetometer-dipole-strength-nt/tool.js";
import {
  calculate as sherd,
  example as sherdExample,
} from "../sherd-weight-total-per-lot/tool.js";
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
  it("preserves a signed modern radiocarbon activity departure", () => {
    expect(
      calculate({
        ...example.input,
        independentlyNormalizedFractionModernActivity: 2,
      }).uncalibratedExponentialAgeYears,
    ).toBeCloseTo(-5730);
  });
  it("looks up forward IntCal values without pretending to invert a multivalued curve", () => {
    const r = intcal({
      ...intcalExample.input,
      callerIntcalC14AgesBp: [0, 200, 100],
      queryCalendarYearBp: 150,
    });
    expect(r.interpolatedReferenceC14AgeBp).toBe(150);
    expect(r.interpolatedReferenceOneSigmaYears).toBe(25);
  });
  it("refuses IntCal extrapolation", () => {
    expect(() =>
      intcal({ ...intcalExample.input, queryCalendarYearBp: 201 }),
    ).toThrow();
  });
  it("rejects a potassium-to-argon branching rate above the total rate", () => {
    expect(() =>
      argon({ ...argonExample.input, callerArBranchDecayPerYear: 0.002 }),
    ).toThrow();
  });
  it("retains the independently measured present U234 excess in the uranium chain", () => {
    const r = uranium({
      ...uraniumExample.input,
      observedU234U238ActivityRatio: 2,
    });
    expect(r.conditionalClosedSystemAgeYears).toBeLessThan(
      uranium(uraniumExample.input).conditionalClosedSystemAgeYears,
    );
  });
  it("refuses an unbracketed uranium age instead of clamping to the caller horizon", () => {
    expect(() =>
      uranium({ ...uraniumExample.input, callerMaximumAgeYears: 1 }),
    ).toThrow();
  });
  it("retains multiple archaeomagnetic reference dates with the same observed direction", () => {
    expect(
      magnetic({
        ...magneticExample.input,
        callerCalibratedDirectionVectors: [
          [1, 0, 0],
          [2, 0, 0],
        ],
      }).compatibleCallerSampledDatesYears,
    ).toEqual([100, 200]);
  });
  it("deduplicates repeated scatter points in the observed convex hull", () => {
    const r = hull({
      ...hullExample.input,
      observedArtifactPlanarCoordinatesMeters: [
        [0, 0],
        [1, 0],
        [1, 0],
        [0, 1],
        [0, 0],
      ],
    });
    expect(r.observedScatterConvexHullAreaM2).toBe(0.5);
  });
  it("retains coincident independently documented settlements instead of inventing spacing", () => {
    expect(
      neighbor({
        ...neighborExample.input,
        observedSettlementPlanarPositionsMeters: [
          [0, 0],
          [0, 0],
        ],
      }).nearestNeighborIndex,
    ).toBe(0);
  });
  it("uses axial dipole field and preserves moment sign", () => {
    expect(
      dipole({ ...dipoleExample.input, observedAxialFieldNt: -200 })
        .idealAxialDipoleMomentAmpereM2,
    ).toBeCloseTo(-8);
  });
  it("uses exact observed lot identity while pooling tare-corrected masses", () => {
    const r = sherd(sherdExample.input);
    expect(r.distinctLotIds).toEqual(["a", "b"]);
    expect(r.netSherdMassPerLotG).toEqual([36, 18]);
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
      independentlyNormalizedFractionModernActivity: 0,
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      independentlyNormalizedFractionModernActivity: 1,
    };
    close(calculate(input), { uncalibratedExponentialAgeYears: 0 });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, { uncalibratedExponentialAgeYears: 0 });
  });
});
