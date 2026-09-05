import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as stp,
  example as stpExample,
} from "../significant-tornado-parameter-stp/tool.js";
import {
  calculate as dcape,
  example as dcapeExample,
} from "../dcape-downdraft-cape/tool.js";
import {
  calculate as idw,
  example as idwExample,
} from "../isopleth-interpolation-idw-stations/tool.js";
import { calculate as category } from "../saffir-simpson-category-from-wind/tool.js";
import {
  calculate as barbs,
  example as barbExample,
} from "../station-model-wind-barb-speed-decode/tool.js";
import {
  calculate as longwave,
  example as longwaveExample,
} from "../downwelling-longwave-clear-sky-parametrization/tool.js";
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
  it("caps the named SCP shear branch and respects the cutoff", () => {
    expect(
      calculate({ ...example.input, effectiveBulkShearMS: 10 })
        .effectiveLayerSupercellComposite,
    ).toBe(0.5);
    expect(
      calculate({ ...example.input, effectiveBulkShearMS: 100 })
        .effectiveLayerSupercellComposite,
    ).toBe(1);
  });
  it("uses the named STP CIN and LCL caps without extrapolation", () => {
    expect(
      stp({ ...stpExample.input, signedMixedLayerCinJKg: -200 })
        .effectiveStpCin,
    ).toBe(0);
    expect(
      stp({
        ...stpExample.input,
        mixedLayerLclM: 500,
        effectiveBulkShearMS: 40,
      }).effectiveStpCin,
    ).toBe(1.5);
  });
  it("resolves downward buoyancy zero crossings", () => {
    expect(
      dcape({
        ...dcapeExample.input,
        observedHeightsM: [0, 2],
        environmentVirtualTemperatureK: [300, 300],
        independentlyDescendedParcelVirtualTemperatureK: [270, 330],
      }).observedDcapeJKg,
    ).toBeCloseTo(0.5);
  });
  it("rejects conflicting colocated IDW stations", () => {
    expect(() =>
      idw({
        ...idwExample.input,
        stationPlanarCoordinates: [
          [0, 0],
          [0, 0],
        ],
        queryX: 0,
      }),
    ).toThrow();
  });
  it("retains identical colocated IDW evidence without selecting one station", () => {
    expect(
      idw({
        ...idwExample.input,
        stationPlanarCoordinates: [
          [0, 0],
          [0, 0],
        ],
        stationValues: [2, 2],
        queryX: 0,
      }).normalizedStationWeights,
    ).toEqual([0.5, 0.5]);
  });
  it.each([
    [63, 0],
    [64, 1],
    [83, 2],
    [96, 3],
    [113, 4],
    [137, 5],
  ])("checks named Saffir–Simpson threshold %s", (wind, result) => {
    expect(
      category({ independentOneMinuteMaximumWindKnots: wind })
        .saffirSimpsonWindCategory,
    ).toBe(result);
  });
  it("rejects contradictory calm-circle and flag evidence", () => {
    expect(() =>
      barbs({ ...barbExample.input, observedCalmCircle: true }),
    ).toThrow();
  });
  it("rejects nonfinite longwave output even for finite scalar evidence", () => {
    expect(() =>
      longwave({ ...longwaveExample.input, observedAirTemperatureK: 1e100 }),
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
    const input = { ...example.input, effectiveBulkShearMS: -1 };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = { ...example.input, effectiveBulkShearMS: 5 };
    close(calculate(input), { effectiveLayerSupercellComposite: 0 });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, { effectiveLayerSupercellComposite: 0 });
  });
});
