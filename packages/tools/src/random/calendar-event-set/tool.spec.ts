import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calendarEventSetExample as example,
  calculateCalendarEventSet,
} from "./tool.js";

describe("Random Calendar Event Set Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCalendarEventSet(example.input)).toEqual({
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
  it("has an exact no-slack partition with touching half-open endpoints", () => {
    const result = tool.execute({
      count: 3,
      startDate: "2024-02-27",
      endDateExclusive: "2024-03-04",
      minimumDurationDays: 2,
      maximumDurationDays: 2,
      overlapPolicy: "forbidden",
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(
      result.output.events.map((event) => [
        event.startDate,
        event.endDateExclusive,
      ]),
    ).toEqual([
      ["2024-02-27", "2024-02-29"],
      ["2024-02-29", "2024-03-02"],
      ["2024-03-02", "2024-03-04"],
    ]);
    expect(result.output.overlappingPairs).toEqual([]);
  });
  it("can generate and accurately label intentional overlapping dates", () => {
    const result = tool.execute(
      {
        count: 2,
        startDate: "2024-01-01",
        endDateExclusive: "2024-01-03",
        minimumDurationDays: 1,
        maximumDurationDays: 1,
        overlapPolicy: "allowed",
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.events.map((event) => event.startDate)).toEqual([
      "2024-01-01",
      "2024-01-01",
    ]);
    expect(result.output.overlappingPairs).toEqual([[0, 1]]);
    for (let seed = 0; seed < 16; seed += 1) {
      const noOverlap = tool.execute({ ...example.input, seed });
      if (!noOverlap.ok) throw new Error("Expected success");
      expect(noOverlap.output.events).toHaveLength(3);
      expect(noOverlap.output.overlappingPairs).toEqual([]);
      for (const event of noOverlap.output.events) {
        expect(event.durationDays).toBeGreaterThanOrEqual(1);
        expect(event.durationDays).toBeLessThanOrEqual(4);
        expect(
          event.startDate >= "2026-10-01" &&
            event.endDateExclusive <= "2026-10-15",
        ).toBe(true);
      }
    }
  });
  it("supports early Gregorian years and rejects impossible or reversed duration/window constraints", () => {
    const early = tool.execute({
      count: 1,
      startDate: "0000-02-28",
      endDateExclusive: "0000-03-01",
      minimumDurationDays: 2,
      maximumDurationDays: 2,
      overlapPolicy: "forbidden",
      seed: 42,
    });
    if (!early.ok) throw new Error("Expected success");
    expect(early.output.events[0].durationDays).toBe(2);
    expect(tool.execute({ ...example.input, count: 20 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "infeasible_event_count" }] },
    });
    expect(
      tool.execute({ ...example.input, maximumDurationDays: 0 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumDurationDays" }] },
    });
    expect(
      tool.execute({ ...example.input, endDateExclusive: "2026-10-01" }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "endDateExclusive", code: "empty_date_window" }],
      },
    });
    expect(
      tool.execute({ ...example.input, startDate: "2026-02-30" }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_calendar_date" }] },
    });
  });
});
