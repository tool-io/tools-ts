import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calendarOverlapGapsExample as example,
  calculateCalendarOverlapGaps,
} from "./tool.js";

describe("calendar overlap and gaps", () => {
  it("matches its UTC-epoch canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("does not count internal overlap twice and treats touching events as nonoverlapping", () => {
    const result = calculateCalendarOverlapGaps({
      calendars: [
        {
          id: "a",
          intervals: [
            [0, 20],
            [10, 30],
          ],
        },
        { id: "b", intervals: [[30, 40]] },
      ],
      windowStartEpochMs: 0,
      windowEndEpochMs: 50,
    });
    expect(result).toEqual({
      ok: true,
      output: {
        segments: [
          {
            startEpochMs: 0,
            endEpochMs: 30,
            durationMs: 30,
            activeCalendarIds: ["a"],
          },
          {
            startEpochMs: 30,
            endEpochMs: 40,
            durationMs: 10,
            activeCalendarIds: ["b"],
          },
          {
            startEpochMs: 40,
            endEpochMs: 50,
            durationMs: 10,
            activeCalendarIds: [],
          },
        ],
        commonFree: [[40, 50]],
        overlaps: [],
        calendarBusyDurationMs: [
          { id: "a", durationMs: 30 },
          { id: "b", durationMs: 10 },
        ],
      },
    });
  });
  it("clips to the window, ignores zero duration, and preserves multiple common gaps", () => {
    const result = tool.execute({
      calendars: [
        {
          id: "a",
          intervals: [
            [-5, 5],
            [30, 35],
            [15, 15],
          ],
        },
        { id: "b", intervals: [[10, 20]] },
      ],
      windowStartEpochMs: 0,
      windowEndEpochMs: 30,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.commonFree).toEqual([
      [5, 10],
      [20, 30],
    ]);
    expect(result.output.calendarBusyDurationMs).toEqual([
      { id: "a", durationMs: 5 },
      { id: "b", durationMs: 10 },
    ]);
    expect(
      result.output.segments.reduce(
        (sum, segment) => sum + segment.durationMs,
        0,
      ),
    ).toBe(30);
  });
  it("covers the explicit window with no calendars and handles IDs without object-prototype collisions", () => {
    expect(
      tool.execute({
        calendars: [],
        windowStartEpochMs: 0,
        windowEndEpochMs: 2,
      }),
    ).toEqual({
      ok: true,
      output: {
        segments: [
          {
            startEpochMs: 0,
            endEpochMs: 2,
            durationMs: 2,
            activeCalendarIds: [],
          },
        ],
        commonFree: [[0, 2]],
        overlaps: [],
        calendarBusyDurationMs: [],
      },
    });
    const result = tool.execute({
      calendars: [{ id: "__proto__", intervals: [[0, 1]] }],
      windowStartEpochMs: 0,
      windowEndEpochMs: 2,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.calendarBusyDurationMs).toEqual([
      { id: "__proto__", durationMs: 1 },
    ]);
  });
  it("independently verifies every canonical cell's membership and conserves occupied/free time", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected success");
    for (const segment of result.output.segments) {
      const midpoint = segment.startEpochMs + segment.durationMs / 2;
      const active = example.input.calendars
        .filter((calendar) =>
          calendar.intervals.some(([a, b]) => a <= midpoint && midpoint < b),
        )
        .map((calendar) => calendar.id)
        .sort();
      expect(segment.activeCalendarIds).toEqual(active);
    }
    expect(
      result.output.segments.reduce(
        (sum, segment) => sum + segment.durationMs,
        0,
      ),
    ).toBe(example.input.windowEndEpochMs - example.input.windowStartEpochMs);
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
  });
  it("reports duplicate IDs, reversed bounds, excessive work, malformed and non-finite data specifically", () => {
    expect(
      tool.execute({
        calendars: [
          { id: "a", intervals: [] },
          { id: "a", intervals: [] },
        ],
        windowStartEpochMs: 0,
        windowEndEpochMs: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "duplicate_calendar_id", field: "calendars.1.id" }],
      },
    });
    expect(
      tool.execute({
        calendars: [{ id: "a", intervals: [[2, 1]] }],
        windowStartEpochMs: 0,
        windowEndEpochMs: 3,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { code: "reversed_interval", field: "calendars.0.intervals.0" },
        ],
      },
    });
    expect(
      tool.execute({
        calendars: [],
        windowStartEpochMs: 2,
        windowEndEpochMs: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_window", field: "windowEndEpochMs" }],
      },
    });
    expect(
      tool.execute({
        calendars: [],
        windowStartEpochMs: -Number.MAX_SAFE_INTEGER,
        windowEndEpochMs: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_window", field: "windowEndEpochMs" }] },
    });
    expect(
      tool.execute({
        calendars: [
          { id: "a", intervals: Array.from({ length: 64 }, () => [0, 1]) },
          { id: "b", intervals: Array.from({ length: 64 }, () => [0, 1]) },
        ],
        windowStartEpochMs: 0,
        windowEndEpochMs: 2,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "resource_limit_exceeded", field: "calendars" }],
      },
    });
    expect(
      tool.execute({ ...example.input, windowStartEpochMs: NaN }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "invalid_field", field: "windowStartEpochMs" }],
      },
    });
    expect(
      tool.execute({ ...example.input, calendars: Array(1) }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "calendars" }] },
    });
    expect(tool.execute({})).toMatchObject({
      ok: false,
      error: {
        issues: tool.inputSchema.required?.map((field) => ({
          code: "required_field",
          field,
        })),
      },
    });
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
  });
});
