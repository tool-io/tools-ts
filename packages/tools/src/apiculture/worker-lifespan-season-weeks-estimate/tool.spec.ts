import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as footprint,
  example as footprintExample,
} from "../hive-stand-footprint-area/tool.js";
import {
  calculate as pallets,
  example as palletExample,
} from "../truckload-maximum-4way-pallets/tool.js";
import {
  calculate as density,
  example as densityExample,
} from "../honey-density-pound-per-gallon/tool.js";
import {
  calculate as microscopy,
  example as microscopyExample,
} from "../nosema-spore-count-per-bee-microscopy/tool.js";
import {
  calculate as trap,
  example as trapExample,
} from "../small-hive-beetle-trap-threshold/tool.js";
import {
  calculate as emerge,
  example as emergeExample,
} from "../queen-cell-capped-emergence-calculator/tool.js";
import { calculate as mark } from "../queen-marking-year-color-code-lookup/tool.js";
import {
  calculate as patties,
  example as pattyExample,
} from "../fondant-patty-count-per-colony/tool.js";
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
  it("retains all-right-censored observations without fabricating a completed mean", () => {
    expect(
      calculate({
        ...example.input,
        independentlyConfirmedDeathFlags: [0, 0, 0],
      }),
    ).toEqual({
      completedObservedLifespansWeeks: [],
      rightCensoredMinimumAgesWeeks: [2, 4, 6],
      meanCompletedObservedWeeks: 0,
      hasCompletedLifespanObservations: false,
    });
  });
  it("does not add overlapping stand footprints twice", () => {
    expect(
      footprint({
        ...footprintExample.input,
        observedStandRectangles: [
          [0, 0, 2, 2],
          [0, 0, 2, 2],
          [1, 1, 3, 3],
        ],
      }).uniqueMeasuredStandFootprintM2,
    ).toBe(7);
  });
  it("keeps disjoint stand footprint area additive", () => {
    expect(
      footprint({
        ...footprintExample.input,
        observedStandRectangles: [
          [0, 0, 1, 1],
          [2, 0, 3, 1],
        ],
      }).uniqueMeasuredStandFootprintM2,
    ).toBe(2);
  });
  it("applies independently supplied payload limits after dimensional packing", () => {
    const r = pallets({ ...palletExample.input, callerPayloadLimitKg: 0 });
    expect(r.bestUniformGridPalletCapacity).toBe(8);
    expect(r.conditionalLimitedPalletCount).toBe(0);
  });
  it("pools honey density by measured volume rather than sample means", () => {
    expect(
      density({
        ...densityExample.input,
        observedHoneyCalibrationMassLb: [1, 9],
        observedSameTemperatureVolumesCallerGallon: [1, 3],
      }).pooledObservedHoneyLbPerCallerGallon,
    ).toBe(2.5);
  });
  it("pools microscopy counts over disjoint homogenate fractions", () => {
    expect(
      microscopy({
        ...microscopyExample.input,
        observedMicroscopySporeCounts: [10, 10],
        observedCountedAliquotFractions: [0.1, 0.9],
      }).pooledMicroscopySporesPerBee,
    ).toBe(2);
  });
  it("does not average unequal trap-exposure rates", () => {
    expect(
      trap({
        ...trapExample.input,
        observedTrapBeetleCounts: [0, 10],
        observedMatchedTrapDays: [10, 1],
      }).pooledBeetlesPerTrapDay,
    ).toBeCloseTo(10 / 11);
  });
  it("retains caller emergence window rather than inventing a fixed day", () => {
    const r = emerge({
      ...emergeExample.input,
      callerMatchedMinimumRemainingDays: 0,
      callerMatchedMaximumRemainingDays: 10,
    });
    expect(r.callerEarliestEmergenceDate).toBe("2026-05-01");
    expect(r.callerLatestEmergenceDate).toBe("2026-05-11");
  });
  it.each([
    [2027, "yellow"],
    [2028, "red"],
    [2029, "green"],
    [2030, "blue"],
    [2031, "white"],
  ] as const)("checks named queen marking convention for %s", (year, color) => {
    expect(mark({ callerQueenBirthYear: year }).standardMarkingColor).toBe(
      color,
    );
  });
  it("keeps whole patty over-allocation separate per colony", () => {
    const r = patties({
      ...pattyExample.input,
      observedColonyTargetPreparedFondantG: [61, 0],
    });
    expect(r.wholePattyCounts).toEqual([2, 0]);
    expect(r.allocationExcessPreparedMassG).toEqual([59, 0]);
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
      observedWorkerAgeWeeks: [-1, 4, 6],
    };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      independentlyConfirmedDeathFlags: [1, 1, 1],
    };
    close(calculate(input), {
      completedObservedLifespansWeeks: [2, 4, 6],
      rightCensoredMinimumAgesWeeks: [],
      meanCompletedObservedWeeks: 4,
      hasCompletedLifespanObservations: true,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        completedObservedLifespansWeeks: [2, 4, 6],
        rightCensoredMinimumAgesWeeks: [],
        meanCompletedObservedWeeks: 4,
        hasCompletedLifespanObservations: true,
      });
  });
});
