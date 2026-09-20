import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  roundRobinScheduleExample as example,
  calculateRoundRobinSchedule,
} from "./tool.js";

describe("Random Round-Robin Schedule Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateRoundRobinSchedule(example.input)).toEqual({
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
  it("independently checks every pair once and no same-round clashes for even/odd fields", () => {
    for (let count = 2; count <= 16; count += 1) {
      const participants = Array.from({ length: count }, (_, i) => "p" + i),
        result = tool.execute({ ...example.input, participants });
      if (!result.ok) throw new Error("Expected success");
      const seen = new Set<string>();
      for (const round of result.output.rounds) {
        const playing = round.matches.flatMap((match) => [
          match.first,
          match.second,
        ]);
        expect(new Set(playing).size).toBe(playing.length);
        if (round.bye !== null) {
          expect(playing).not.toContain(round.bye);
          expect(count % 2).toBe(1);
        } else expect(count % 2).toBe(0);
        for (const match of round.matches) {
          const a = participants.indexOf(match.first),
            b = participants.indexOf(match.second),
            key = Math.min(a, b) + "|" + Math.max(a, b);
          expect(seen.has(key)).toBe(false);
          seen.add(key);
        }
      }
      for (let a = 0; a < count; a += 1)
        for (let b = a + 1; b < count; b += 1)
          expect(seen.has(a + "|" + b)).toBe(true);
      expect(seen.size).toBe((count * (count - 1)) / 2);
    }
  });
  it("crosses leap days and handles years below 100 without Date.UTC remapping", () => {
    for (const [startDate, expected] of [
      ["2024-02-28", ["2024-02-28", "2024-02-29", "2024-03-01"]],
      ["0000-02-28", ["0000-02-28", "0000-02-29", "0000-03-01"]],
      ["0099-12-31", ["0099-12-31", "0100-01-01", "0100-01-02"]],
    ] as const) {
      const result = tool.execute({
        ...example.input,
        startDate,
        roundIntervalDays: 1,
      });
      if (!result.ok) throw new Error("Expected success");
      expect(result.output.rounds.map((round) => round.date)).toEqual(expected);
    }
    expect(
      tool.execute({ ...example.input, startDate: "2023-02-29" }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "startDate", code: "invalid_calendar_date" }],
      },
    });
    expect(
      tool.execute({ ...example.input, startDate: "9999-12-31" }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "roundIntervalDays", code: "date_range_exceeded" }],
      },
    });
    expect(
      tool.execute({ ...example.input, participants: ["A", "A"] }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "participants", code: "invalid_participant_ids" }],
      },
    });
  });
});
