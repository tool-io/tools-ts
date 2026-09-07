import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import {
  calculate as intake,
  example as intakeExample,
} from "../feed-intake-instar-share-percent/tool.js";
import {
  calculate as spin,
  example as spinExample,
} from "../spinning-to-cocoon-days/tool.js";
import {
  calculate as room,
  example as roomExample,
} from "../rearing-room-temp-stage-lookup/tool.js";
import {
  calculate as prune,
  example as pruneExample,
} from "../pruning-cycle-days-mulberry/tool.js";
import {
  calculate as incubation,
  example as incubationExample,
} from "../incubation-days-temp-humidity-table/tool.js";
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
  it("distinguishes observed feeding stages from intervening molts", () => {
    const r = calculate({
      ...example.input,
      callerMatchedFiveInstarDurationsDays: [1, 1, 1, 1, 1],
      callerMatchedFourMoltDurationsDays: [2, 2, 2, 2],
    });
    expect(r.callerFeedingStageDays).toBe(5);
    expect(r.callerMoltStageDays).toBe(8);
    expect(r.callerCombinedInstarDays).toBe(13);
  });
  it("rejects a sixth invented instar rather than silently dropping it", () => {
    expect(() =>
      calculate({
        ...example.input,
        callerMatchedFiveInstarDurationsDays: [1, 1, 1, 1, 1, 1],
      }),
    ).toThrow();
  });
  it("uses observed five-instar dry-intake totals without equal-share assumptions", () => {
    expect(
      intake({
        ...intakeExample.input,
        observedFiveInstarConsumedLeafDryG: [0, 0, 0, 0, 100],
      }).observedInstarIntakeSharesPercent,
    ).toEqual([0, 0, 0, 0, 100]);
  });
  it("retains elapsed event pairs rather than assigning standard spinning duration", () => {
    expect(
      spin({
        ...spinExample.input,
        observedSpinningToCocoonStartDayOffsets: [1, 5],
        observedSpinningToCocoonEndDayOffsets: [2, 10],
      }).observedElapsedTimes,
    ).toEqual([1, 5]);
  });
  it("preserves unknown room criteria with explicit indices", () => {
    const r = room({
      ...roomExample.input,
      knownObservedRearingStageTemperatureFlags: [0, 0],
    });
    expect(r.signedKnownMargins).toEqual([0, 0]);
    expect(r.unknownIndices).toEqual([0, 1]);
    expect(r.knownReviewIndices).toEqual([]);
  });
  it("does not mark the exact pruning policy boundary short", () => {
    expect(
      prune({
        ...pruneExample.input,
        callerMatchedMinimumPruningIntervalDays: 20,
      }).callerShortIntervalIndices,
    ).toEqual([]);
  });
  it("refuses absent incubation context/edition rather than inventing a condition table", () => {
    expect(() =>
      incubation({
        ...incubationExample.input,
        queryIncubationConditionTableKey: "unverified",
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
    const input = { ...example.input, callerMatchedFourMoltDurationsDays: [1] };
    expect(() => calculate(input as unknown as Input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary evidence", () => {
    const input = {
      ...example.input,
      callerMatchedFourMoltDurationsDays: [0, 0, 0, 0],
    };
    close(calculate(input), {
      callerFeedingStageDays: 20,
      callerMoltStageDays: 0,
      callerCombinedInstarDays: 20,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        callerFeedingStageDays: 20,
        callerMoltStageDays: 0,
        callerCombinedInstarDays: 20,
      });
  });
});
