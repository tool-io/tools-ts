import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  recurrenceScheduleExample as example,
  calculateRecurrenceSchedule,
} from "./tool.js";

describe("Random Recurrence Schedule Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateRecurrenceSchedule(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("uses sequential month-end clamping rather than anchored month ends", () => {
    const result = tool.execute({
      ...example.input,
      scheduleCount: 1,
      minimumStartDate: "2024-01-31",
      maximumStartDate: "2024-01-31",
      frequencies: ["monthly"],
      minimumInterval: 1,
      maximumInterval: 1,
      minimumOccurrences: 3,
      maximumOccurrences: 3,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        schedules: [
          { occurrences: ["2024-01-31", "2024-02-29", "2024-03-29"] },
        ],
      },
    });
  });
  it("preserves Gregorian year zero and only checks requested occurrences", () => {
    const base = {
      ...example.input,
      scheduleCount: 1,
      frequencies: ["yearly"],
      minimumInterval: 1,
      maximumInterval: 1,
      minimumOccurrences: 3,
      maximumOccurrences: 3,
    };
    expect(
      tool.execute({
        ...base,
        minimumStartDate: "0000-02-29",
        maximumStartDate: "0000-02-29",
      }),
    ).toMatchObject({
      ok: true,
      output: {
        schedules: [
          { occurrences: ["0000-02-29", "0001-02-28", "0002-02-28"] },
        ],
      },
    });
    expect(
      tool.execute({
        ...base,
        minimumStartDate: "9999-12-31",
        maximumStartDate: "9999-12-31",
        minimumOccurrences: 1,
        maximumOccurrences: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: { schedules: [{ occurrences: ["9999-12-31"] }] },
    });
    expect(
      tool.execute({
        ...base,
        minimumStartDate: "9999-12-31",
        maximumStartDate: "9999-12-31",
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "date_range_exceeded" }] },
    });
  });
  it("rejects reversed bounds, duplicate frequencies, invalid dates, and unsupported rules", () => {
    for (const change of [
      { minimumInterval: 3 },
      { minimumOccurrences: 5 },
      { minimumStartDate: "2025-01-01" },
      { maximumStartDate: "2024-02-30" },
      { frequencies: ["weekly", "weekly"] },
      { frequencies: ["hourly"] },
      { frequencies: [] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
