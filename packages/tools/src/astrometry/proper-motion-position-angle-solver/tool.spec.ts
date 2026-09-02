import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as matrixScale,
  example as matrixExample,
} from "../pixel-scale-from-cdmatrix-derivation-calculator/tool.js";
import {
  calculate as parity,
  example as parityExample,
} from "../wcs-cd-matrix-orientation-sign-checker/tool.js";
import {
  calculate as affine,
  example as affineExample,
} from "../plate-solution-coefficient-count-checker/tool.js";
import {
  calculate as correction,
  example as correctionExample,
} from "../relative-to-absolute-parallax-adder/tool.js";
import {
  calculate as lsr,
  example as lsrExample,
} from "../peculiar-velocity-lsr-residual-calculator/tool.js";
import {
  calculate as perspective,
  example as perspectiveExample,
} from "../perspective-acceleration-rate-estimator/tool.js";
import {
  calculate as ha,
  example as haExample,
} from "../hour-angle-ra-lst-solver/tool.js";
import {
  calculate as completeness,
  example as completenessExample,
} from "../sixparam-pseudocolour-presence-checker/tool.js";
import {
  calculate as air,
  example as airExample,
} from "../airmass-planeparallel-approximation-calculator/tool.js";
import {
  calculate as range,
  example as rangeExample,
} from "../lunar-laser-ranging-precision-note-generator/tool.js";
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
  it("measures motion angle east of north, not counterclockwise from east", () => {
    expect(
      calculate({
        ...example.input,
        eastRaStarMasPerYear: 0,
        northDecMasPerYear: 1,
      }).positionAngleEastOfNorthDegrees,
    ).toBe(0);
    expect(
      calculate({
        ...example.input,
        eastRaStarMasPerYear: 0,
        northDecMasPerYear: -1,
      }).positionAngleEastOfNorthDegrees,
    ).toBe(180);
  });
  it("refuses a zero proper-motion direction", () => {
    expect(() =>
      calculate({
        ...example.input,
        eastRaStarMasPerYear: 0,
        northDecMasPerYear: 0,
      }),
    ).toThrow();
  });
  it("retains anisotropic WCS pixel-axis scales rather than area-root scale", () => {
    const r = matrixScale({
      ...matrixExample.input,
      callerWcsCdDegreesPerPixel: [
        [1, 2],
        [0, 0],
      ],
    });
    expect(r.imageColumnPixelScaleArcsec).toBe(3600);
    expect(r.imageRowPixelScaleArcsec).toBe(7200);
  });
  it("reports singular CD orientation explicitly without pretending handedness", () => {
    expect(
      parity({
        ...parityExample.input,
        callerWcsCdDegreesPerPixel: [
          [1, 2],
          [2, 4],
        ],
      }).orientationParity,
    ).toBe(0);
  });
  it("does not convert nominal affine coefficient sufficiency into fit rank", () => {
    expect(
      affine({ ...affineExample.input, observedMatchedReferenceStarCount: 1 })
        .nominalScalarFitDegreesOfFreedom,
    ).toBe(-4);
  });
  it("preserves a nonpositive corrected relative parallax without inversion", () => {
    expect(
      correction(correctionExample.input).correctedAbsoluteParallaxMas,
    ).toBeCloseTo(-0.8);
  });
  it("adds caller solar motion before subtracting LSR reference", () => {
    expect(lsr(lsrExample.input).residualUvwKmPerSecond).toEqual([11, 17, 33]);
  });
  it("changes perspective acceleration sign for approaching radial motion", () => {
    expect(
      perspective({
        ...perspectiveExample.input,
        radialVelocityKmPerSecond: -10,
      }).signedPerspectiveAccelerationMasPerYearSquared,
    ).toBeGreaterThan(0);
  });
  it("wraps RA and LST differences through midnight with the signed hour convention", () => {
    expect(
      ha({ ...haExample.input, localSiderealHours: 23, rightAscensionHours: 1 })
        .signedHourAngleHours,
    ).toBe(-2);
  });
  it("requires independently known pseudocolour for the six-parameter inventory", () => {
    expect(
      completeness({
        ...completenessExample.input,
        callerKnownParameterFlags: [1, 1, 1, 1, 1, 0],
      }).missingRequiredParameterIds,
    ).toEqual(["pseudocolour"]);
  });
  it("refuses plane-parallel air mass near the horizon", () => {
    expect(() =>
      air({ ...airExample.input, zenithAngleDegrees: 76 }),
    ).toThrow();
  });
  it("halves round-trip propagation time for one-way ranging", () => {
    const r = range({
      ...rangeExample.input,
      observedRoundTripSeconds: 2,
      callerPathPropagationSpeedMetersPerSecond: 1,
    });
    expect(r.conditionalOneWayDistanceCm).toBe(100);
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
      eastRaStarMasPerYear: 0,
      northDecMasPerYear: 0,
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, eastRaStarMasPerYear: -1 };
    close(calculate(input), { positionAngleEastOfNorthDegrees: 270 });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, { positionAngleEastOfNorthDegrees: 270 });
  });
});
